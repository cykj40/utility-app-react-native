/* eslint-disable prettier/prettier */
import { StyleSheet, View } from "react-native";
import { theme } from "./theme";
import ShoppingListItem from "./components/ShoppingListItem";

export default function App() {
  return (
    <View style={styles.container}>
      <ShoppingListItem name="coffee" isCompleted={true} />
      <ShoppingListItem name="tea" isCompleted={true} />
      <ShoppingListItem name="sugar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center"
  }
});