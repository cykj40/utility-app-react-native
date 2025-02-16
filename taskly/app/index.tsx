/* eslint-disable prettier/prettier */
import { StyleSheet, TextInput, FlatList, Text, View } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState } from "react";



type ShoppingListItemType = {
  id: string;
  name: string;

}

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Tea" },
  { id: "3", name: "Sugar" }
]

export default function App() {
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toTimeString(), name: value },
        ...shoppingList,
      ]
      setShoppingList(newShoppingList);
      setValue("");
    }
  };

  return (
    <FlatList
      data={shoppingList}
      renderItem={({ item }) => <ShoppingListItem name={item.name} />}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>No items in the list</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          style={styles.textInput}
          placeholder="E.G. Buy coffee"
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 12
  },
  contentContainer: {
    paddingTop: 24,
    justifyContent: "center"
  },
  textInput: {
    borderColor: theme.colorLightGray,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    borderRadius: 50,
    marginBottom: 12,
    fontSize: 18,
    backgroundColor: theme.colorWhite
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18
  }
});