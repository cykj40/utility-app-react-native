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
        <FlatList
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
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
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        marginTop: 8,
    },

    list: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colorWhite,
    },
    text: {
        fontSize: 24,

    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderRadius: 6,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 16,
    }
});