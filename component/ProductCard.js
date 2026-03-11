import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Switch,
  TextInput,
} from "react-native";

const ProductCard = ({ product }) => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <View style={styles.card}>
      <Image
        source={require("../images/smart_litterbox.webp")}
        style={styles.image}
      />
      <Text style={styles.title}>Automatic Litterbox</Text>
      <Text style={styles.description}>
        Keeps your home clean and odor-free
      </Text>
      <Text style={styles.description}>Price: $199.99</Text>
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
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </Pressable>
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
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductCard;
