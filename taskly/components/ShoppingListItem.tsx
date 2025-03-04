/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Alert, Pressable } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';


type Props = {
    name: string;
    isCompleted?: boolean;
    onDelete: () => void;
    onToggleCompleted: () => void;
}

export default function ShoppingListItem({ name, isCompleted, onDelete, onToggleCompleted }: Props) {
    const handleDelete = () => {
        Alert.alert(
            `Are you sure you want to delete this ${name}?`,
            "It will be gone for good",
            [
                {
                    text: "Yes",
                    onPress: () => onDelete(),
                    style: "destructive",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
        );
    };

    return (
        <Pressable
            style={[
                styles.itemContainer,
                isCompleted ? styles.completedContainer : undefined
            ]}
            onPress={onToggleCompleted}
        >
            <View style={styles.row}>
                <Entypo name={isCompleted ? "check" : "circle"} size={24} color={isCompleted ? theme.colorGray : theme.colorCerulean} />
                <Text style={[
                    styles.itemText,
                    isCompleted ? styles.completedText : undefined
                ]}
                >
                    {name}
                </Text>
            </View>

            <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
                <AntDesign name="closecircle" size={24} color={isCompleted ? theme.colorGray : theme.colorRed} />
            </TouchableOpacity>
        </Pressable>
    );
}

const styles = StyleSheet.create({

    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colorCerulean,
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    completedContainer: {
        backgroundColor: theme.colorLightGray,
        borderBottomColor: theme.colorLightGray,
    },
    itemText: {
        fontSize: 18,
        fontWeight: "200",
        flex: 1,
    },
    completedText: {
        textDecorationLine: "line-through",
        textDecorationColor: theme.colorGray,
        color: theme.colorGray,
    },
    row: {
        flexDirection: "row",
        gap: 8,
        flex: 1,
    },
});

