import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView, View, Image } from "react-native";
import ProductCard from "../component/ProductCard";

const HomeScreen = (navigation) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text>This is a component</Text>
      <View style={styles.grid}>
        <View style={styles.card}>
          <ProductCard
            title="Automatic Litterbox"
            description="Keeps your home clean and odor-free"
            price="199.99"
            image={require("../assets/smart_litterbox.png")}
            onPress={() =>
              navigation.navigate("Details", {
                title: "Automatic Litterbox",
                description: "Keeps your home clean and odor-free",
                price: "199.99",
                image: require("../assets/smart_litterbox.png"),
              })
            }
          />
        </View>
        <View style={styles.card}>
          <ProductCard />
        </View>
        <View style={styles.card}>
          <ProductCard />
        </View>
        <View style={styles.card}>
          <ProductCard />
        </View>
        <View style={styles.card}>
          <ProductCard />
        </View>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
  },
});

export default HomeScreen;
