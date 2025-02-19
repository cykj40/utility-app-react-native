/* eslint-disable prettier/prettier */
import { StyleSheet, TextInput, FlatList, Text, View, LayoutAnimation } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState, useEffect } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";

const storageKey = "shoppingList";



type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
}

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee", lastUpdatedTimestamp: Date.now() },
  { id: "2", name: "Tea", lastUpdatedTimestamp: Date.now() },
  { id: "3", name: "Sugar", lastUpdatedTimestamp: Date.now() }
]

export default function App() {
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);
  const [value, setValue] = useState("");

  useEffect(() => {
    const loadShoppingList = async () => {
      const savedList = await getFromStorage(storageKey);
      if (savedList) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(savedList);
      }
    }
    loadShoppingList();
  }, []);

  const handleSubmit = async () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toTimeString(), name: value, lastUpdatedTimestamp: Date.now() },
        ...shoppingList,
      ]
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShoppingList(newShoppingList);
      await saveToStorage(storageKey, newShoppingList);
      setValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter(item => item.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveToStorage(storageKey, newShoppingList);
  }

  const handleToggleCompleted = async (id: string) => {
    const newShoppingList = shoppingList.map(item => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return { ...item, completedAtTimestamp: item.completedAtTimestamp ? undefined : Date.now() };
      }
      return item;
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
    await saveToStorage(storageKey, newShoppingList);
  }

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          isCompleted={!!item.completedAtTimestamp}
          onDelete={() => handleDelete(item.id)}
          onToggleCompleted={() => handleToggleCompleted(item.id)}
        />
      )}
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

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12
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