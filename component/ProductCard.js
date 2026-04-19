import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Switch,
  TextInput,
} from "react-native";

const ProductCard = ({
  id = "untitled",
  title = "Automatic Litterbox",
  description = "Keeps your home clean and odor-free.",
  price = "199.99",
  image = require("../assets/smart_litterbox.png"),
  imageUrl = "",
  onPress,
  onAddToCart,
}) => {
  const [subscribed, setSubscribed] = useState(false);
  const navigation = useNavigation();

  const handleAddToCart = () => {
    console.log("Add to Cart pressed for:", title);
    if (onAddToCart) {
      // Extract the actual URL from the image object if needed
      const imageString = typeof image === "string" ? image : imageUrl;
      console.log("Calling onAddToCart with:", {
        id,
        title,
        price,
        image: imageString,
      });
      onAddToCart({ id, title, price, image: imageString });
    } else {
      console.log("onAddToCart callback not provided!");
    }
  };

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.description}>${price}</Text>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Auto-Refill Subscription</Text>
        <Switch value={subscribed} onValueChange={setSubscribed} />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.detailsButton]}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Details</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.cartButton]}
          onPress={handleAddToCart}
        >
          <Text style={[styles.buttonText, styles.cartButtonText]}>
            Add to Cart
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  detailsButton: {
    backgroundColor: "#007AFF",
  },
  cartButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cartButtonText: {
    color: "#fff",
  },
});

export default ProductCard;
