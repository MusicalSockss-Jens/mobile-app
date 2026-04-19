import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView, View, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

const BlogDetail = () => {
  const route = useRoute();

  const {
    title = "Blog Title",
    htmlContent = "<p>Blog content goes here...</p>",
    image = require("../assets/smart_litterbox.png"),
  } = route.params || {};

  const imageSource = typeof image === "string" ? { uri: image } : image;

  // Zorgt dat de blog de juist opmaak heeft
  const renderHtmlContent = (html) => {
    if (!html) return null;

    // Split by common HTML tags
    const sections = [];
    let remaining = html;

    const tagRegex = /<\/?[^>]+>/g;
    const parts = remaining.split(tagRegex);
    const tags = remaining.match(tagRegex) || [];

    let tagIndex = 0;
    let key = 0;

    for (let i = 0; i < parts.length; i++) {
      const text = parts[i].trim();
      let currentTag = tags[tagIndex]?.toLowerCase() || "";

      if (text) {
        if (currentTag.includes("h2")) {
          sections.push(
            <Text key={key++} style={styles.h2}>
              {text}
            </Text>,
          );
        } else if (currentTag.includes("h3")) {
          sections.push(
            <Text key={key++} style={styles.h3}>
              {text}
            </Text>,
          );
        } else if (currentTag.includes("li")) {
          sections.push(
            <Text key={key++} style={styles.li}>
              • {text}
            </Text>,
          );
        } else {
          // Check if text contains strong tags
          const strongParts = text.split(/(<strong>|<\/strong>)/);
          if (strongParts.length > 1) {
            sections.push(
              <Text key={key++} style={styles.p}>
                {strongParts.map((part, idx) =>
                  part === "<strong>" || part === "</strong>" ? null : (
                    <Text
                      key={idx}
                      style={
                        strongParts[idx - 1] === "<strong>" ? styles.strong : {}
                      }
                    >
                      {part}
                    </Text>
                  ),
                )}
              </Text>,
            );
          } else {
            sections.push(
              <Text key={key++} style={styles.p}>
                {text}
              </Text>,
            );
          }
        }
      }

      tagIndex++;
    }

    return sections;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.screenTitle}>Blog Article</Text>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <View>{renderHtmlContent(htmlContent)}</View>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  h2: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14,
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    lineHeight: 26,
  },
  p: {
    fontSize: 16,
    lineHeight: 26,
    color: "#555",
    marginBottom: 12,
  },
  strong: {
    fontWeight: "bold",
    color: "#333",
  },
  li: {
    fontSize: 16,
    lineHeight: 26,
    color: "#555",
    marginBottom: 8,
    marginLeft: 0,
  },
});

export default BlogDetail;
