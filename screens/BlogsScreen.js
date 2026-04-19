import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { useState, useEffect } from "react";
import BlogCard from "../component/BlogCard";
import { API_CONFIG, API_ENDPOINTS } from "../config";

const BlogsScreen = ({ navigation }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching blogs from:", API_ENDPOINTS.blogs);

      const response = await fetch(API_ENDPOINTS.blogs, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_CONFIG.token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Webflow returns blog items in data.items array
      const blogsArray = data.items || data.blogs || data.data || [];
      console.log("Blogs found:", blogsArray.length);

      // Log first blog to see available fields
      if (blogsArray.length > 0) {
        console.log("First blog object:", blogsArray[0]);
      }

      // Transform API response to match our component props
      const formattedBlogs = blogsArray.map((item) => {
        const blogData = item.fieldData || {};
        const blogId = item.id;

        // Get featured image
        let featuredImage = "https://via.placeholder.com/300x300?text=No+Image";
        const imageField = blogData["featured-image"];
        if (imageField) {
          if (typeof imageField === "object" && imageField.url) {
            featuredImage = imageField.url;
          } else if (typeof imageField === "string") {
            featuredImage = imageField;
          }
        }

        // Get publish date
        const publishDate =
          blogData["publish-date"] || new Date().toISOString();
        const formattedDate = new Date(publishDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        // Get author
        const author = blogData.author || "Anonymous";

        // Keep full content for detail page
        const fullContent = blogData.body || blogData.content || "";

        // Truncate content to first 150 characters for blog card display
        let displayContent = fullContent;
        if (displayContent.length > 150) {
          displayContent = displayContent.substring(0, 150) + "...";
        }

        const blog = {
          id: blogId,
          title: blogData.name || blogData.title || "Untitled",
          content: displayContent, // Truncated for list view
          fullContent: fullContent, // Full content for detail page
          image: featuredImage,
          date: formattedDate,
          author: author,
        };

        return blog;
      });

      setBlogs(formattedBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogPress = (blog) => {
    navigation.navigate("BlogDetails", {
      title: blog.title,
      content: blog.fullContent,
      image: blog.image,
      date: blog.date,
      author: blog.author,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading blogs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Blog Posts</Text>
      <View style={styles.grid}>
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            content={blog.content}
            image={blog.image}
            date={blog.date}
            author={blog.author}
            onPress={() => handleBlogPress(blog)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingTop: 20,
    paddingLeft: 16,
    paddingBottom: 16,
    color: "#333",
  },
  grid: {
    flexDirection: "column",
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#d32f2f",
  },
});

export default BlogsScreen;
