/* eslint-disable prettier/prettier */
import { Stack } from "expo-router";
import { Link } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from "../../theme";
import { Pressable } from "react-native";
export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Counter",
                    headerRight: () => {
                        return (
                            <Link href="/counter/history" asChild>
                                <Pressable hitSlop={20}>
                                    <MaterialIcons
                                        name="history"
                                        size={32}
                                        color={theme.colorGray} />
                                </Pressable>
                            </Link>
                        );
                    }

                }} />
        </Stack>
    );
}