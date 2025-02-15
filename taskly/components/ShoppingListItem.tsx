/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";


type Props = {
    name: string;
    isCompleted?: boolean;
}

export default function ShoppingListItem({ name, isCompleted }: Props) {
    const handleDelete = () => {
        Alert.alert(
            `Are you sure you want to delete this ${name}?`,
            "It will be gone for good",
            [
                {
                    text: "Yes",
                    onPress: () => console.log("ok, deleting"),
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
        <View style={[styles.itemContainer, isCompleted ? styles.completedContainer : undefined]}>
            <Text style={[
                styles.itemText,
                isCompleted ? styles.completedText : undefined
            ]}
            >
                {name}
            </Text>
            <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
                <AntDesign name="closecircle" size={24} color={isCompleted ? theme.colorGray : theme.colorRed} />
            </TouchableOpacity>
        </View>
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
    },
    completedText: {
        textDecorationLine: "line-through",
        textDecorationColor: theme.colorGray,
        color: theme.colorGray,
    },

});

