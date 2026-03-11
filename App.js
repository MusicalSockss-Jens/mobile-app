import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView } from "react-native";
import ProductCard from "./component/ProductCard";

export default function App() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text>This is a component</Text>
      <View style={styles.grid}>
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
}

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
