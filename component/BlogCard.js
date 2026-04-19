import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";

const BlogCard = ({
  title = "Blog Title",
  content = "Blog excerpt goes here...",
  image = require("../assets/smart_litterbox.png"),
  onPress,
}) => {
  const imageSource = typeof image === "string" ? { uri: image } : image;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={3}>
          {content}
        </Text>
        <Text style={styles.readMore}>Read more →</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  excerpt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default BlogCard;
