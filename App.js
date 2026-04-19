import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import ProductDetail from "./screens/ProductDetail";
import BlogsScreen from "./screens/BlogsScreen";
import BlogDetail from "./screens/BlogDetail";
import CartScreen from "./screens/CartScreen";
import { CartProvider } from "./context/CartContext";

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={HomeScreen} />
          <Screen name="Details" component={ProductDetail} />
          <Screen name="Blogs" component={BlogsScreen} />
          <Screen name="BlogDetails" component={BlogDetail} />
          <Screen name="Cart" component={CartScreen} />
        </Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
