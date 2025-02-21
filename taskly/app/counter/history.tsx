/* eslint-disable prettier/prettier */

import { useState } from "react";
import { PersistedCountdownState } from ".";
import { useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { getFromStorage } from "../../utils/storage";
import { countdownStorageKey } from ".";
import { format } from "date-fns";
import { theme } from "../../theme";


export default function HistoryScreen() {
    const [countdownState, setCountdownState] = useState<PersistedCountdownState | null>(null);
    useEffect(() => {
        const init = async () => {
            const value = await getFromStorage(countdownStorageKey);
            setCountdownState(value);
        };
        init();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={countdownState?.completedAtTimestamps}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No history</Text>
                }
                renderItem={({ item }) => {
                    const date = new Date(item);
                    const formattedDate = format(date, "MMM d, yyyy h:mm a");
                    return (
                        <View style={styles.item}>
                            <Text style={styles.text}>{formattedDate}</Text>
                        </View>
                    );
                }}
                keyExtractor={item => item.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colorWhite,
    },
    text: {
        fontSize: 18,
        color: theme.colorBlack,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    emptyText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 24,
        color: theme.colorGray,
    }
});