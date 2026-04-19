import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import ProductCard from "../component/ProductCard";
import BlogCard from "../component/BlogCard";
import { API_CONFIG, API_ENDPOINTS } from "../config";
import { useCart } from "../context/CartContext";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, getTotalItems } = useCart();
  const cartCount = getTotalItems();

  const stripHtml = (html) => {
    if (typeof html !== "string") return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const extractTextValue = (value) => {
    if (value == null) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) {
      return value.map(extractTextValue).filter(Boolean).join(" ").trim();
    }
    if (typeof value === "object") {
      if (typeof value.text === "string") return value.text.trim();
      if (typeof value.value === "string") return value.value.trim();
      if (typeof value.html === "string") return stripHtml(value.html);
      if (typeof value.richText === "string") return stripHtml(value.richText);
      if (Array.isArray(value.richText))
        return extractTextValue(value.richText);
      return Object.values(value)
        .map(extractTextValue)
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    return "";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both products and blogs in parallel
      const [productsResponse, blogsResponse] = await Promise.all([
        fetch(API_ENDPOINTS.products, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_CONFIG.token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(API_ENDPOINTS.blogs, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_CONFIG.token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!productsResponse.ok) {
        throw new Error(`Products API Error: ${productsResponse.status}`);
      }
      if (!blogsResponse.ok) {
        throw new Error(`Blogs API Error: ${blogsResponse.status}`);
      }

      const productsData = await productsResponse.json();
      const blogsData = await blogsResponse.json();

      // Transform Products
      const productsArray = productsData.items || productsData.products || [];
      const formattedProducts = productsArray.map((item) => {
        const productData = item.product?.fieldData || item.fieldData || {};
        const productId = item.product?.id || item.id;

        let price = "0.00";
        let mainImage = "https://via.placeholder.com/300x300?text=No+Image";

        if (item.skus && item.skus.length > 0) {
          const skuFieldData = item.skus[0]?.fieldData;

          const skuPrice = skuFieldData?.price;
          if (skuPrice) {
            let priceValue = skuPrice;
            if (typeof skuPrice === "object") {
              priceValue = skuPrice.value || skuPrice.amount || 0;
            }
            const numPrice = parseFloat(priceValue) / 100;
            if (!isNaN(numPrice) && numPrice > 0) {
              price = numPrice.toFixed(2);
            }
          }

          const skuImage = skuFieldData?.["main-image"];
          if (skuImage) {
            if (typeof skuImage === "object" && skuImage.url) {
              mainImage = skuImage.url;
            } else if (typeof skuImage === "string") {
              mainImage = skuImage;
            }
          }
        }

        const fullDescription = productData.description || "";
        let displayDescription = fullDescription;
        if (displayDescription.length > 120) {
          displayDescription = displayDescription.substring(0, 120) + "...";
        }

        return {
          id: productId,
          title: productData.name || "Untitled",
          description: displayDescription,
          fullDescription: fullDescription,
          price: price,
          image: mainImage,
        };
      });

      // Transform Blogs
      const blogsArray = blogsData.items || blogsData.blogs || [];
      const formattedBlogs = blogsArray.map((item) => {
        const blogData = item.fieldData || item || {};
        const blogId = item.id || item._id || blogData._id || blogData.id;

        let featuredImage = "https://via.placeholder.com/300x300?text=No+Image";
        const imageField =
          blogData["featured-image"] ||
          blogData["feature-image"] ||
          blogData.image ||
          blogData["main-image"] ||
          blogData.thumbnail ||
          blogData.banner;
        if (imageField) {
          if (typeof imageField === "object" && imageField.url) {
            featuredImage = imageField.url;
          } else if (typeof imageField === "string") {
            featuredImage = imageField;
          }
        }

        const fullContentRaw =
          blogData["post-body"] ||
          blogData.body ||
          blogData.content ||
          blogData.summary ||
          blogData.description ||
          blogData.post ||
          blogData.text ||
          item["post-body"] ||
          item.body ||
          item.content ||
          item.description ||
          "";
        const fullContentHtml = String(fullContentRaw);
        const fullContentText = extractTextValue(fullContentRaw);

        const shortBlurbRaw =
          blogData["post-summary"] ||
          blogData.summary ||
          blogData.excerpt ||
          blogData.description ||
          blogData.post ||
          blogData.text ||
          item["post-summary"] ||
          item.summary ||
          item.excerpt ||
          item.description ||
          item.content ||
          fullContentText ||
          "";
        let displayContent = extractTextValue(shortBlurbRaw);
        if (!displayContent) {
          displayContent = fullContentText.substring(0, 120);
        }
        if (displayContent.length > 120) {
          displayContent = displayContent.substring(0, 120) + "...";
        }

        return {
          id: blogId,
          title: extractTextValue(
            blogData.name ||
              blogData.title ||
              item.name ||
              item.title ||
              "Untitled",
          ),
          content: displayContent,
          fullContent: fullContentHtml,
          image: featuredImage,
          date: blogData["publish-date"] || "",
          author: blogData.author || "",
        };
      });

      setProducts(formattedProducts);
      setBlogs(formattedBlogs);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate("Details", {
      title: product.title,
      description: product.fullDescription,
      price: product.price,
      image: product.image,
    });
  };

  const handleBlogPress = (blog) => {
    navigation.navigate("BlogDetails", {
      title: blog.title,
      htmlContent: blog.fullContent,
      image: blog.image,
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            console.log("Navigating to Cart with", cartCount, "items");
            navigation.navigate("Cart");
          }}
        >
          <Text style={styles.cartButtonText}>🛒 Cart</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <StatusBar style="auto" />

        {loading && <Text style={styles.status}>Loading...</Text>}
        {error && <Text style={styles.error}>Error: {error}</Text>}

        {!loading && !error && (
          <>
            {/* Shop Section */}
            <Text style={styles.sectionTitle}>Shop</Text>
            <View style={styles.grid}>
              {products.map((item) => (
                <View style={styles.cardWrapper} key={item.id}>
                  <ProductCard
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    image={{ uri: item.image }}
                    imageUrl={item.image}
                    onPress={() => handleProductPress(item)}
                    onAddToCart={() => {
                      console.log(
                        "HomeScreen: onAddToCart callback triggered for:",
                        item.title,
                      );
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: parseFloat(item.price),
                        image: item.image,
                      });
                    }}
                  />
                </View>
              ))}
            </View>

            {/* Blogs Section */}
            <Text style={styles.sectionTitle}>Blogs</Text>
            <View style={styles.blogsList}>
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  content={blog.content}
                  image={blog.image}
                  onPress={() => handleBlogPress(blog)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  cartButton: {
    position: "relative",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 16,
    paddingTop: 20,
    paddingBottom: 12,
    color: "#333",
  },
  status: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  error: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
    padding: 10,
    textAlign: "center",
    backgroundColor: "#ffe6e6",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  cardWrapper: {
    width: "48%",
    marginHorizontal: "1%",
    marginBottom: 16,
  },
  blogsList: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
