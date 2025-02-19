/* eslint-disable prettier/prettier */
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function CounterScreen() {
    const [permission, setPermission] = useState<string | null>(null);

    const scheduleNotification = async () => {
        const result = await registerForPushNotificationsAsync();
        setPermission(result);
        if (result === "granted") {
            setTimeout(async () => {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Hello",
                        body: "This is a test notification",
                    },
                    trigger: null,
                });
            }, 2000);
        } else {
            if (Device.isDevice) {
                Alert.alert("Unable to schedule notification. Enable the notification permission for expo in settings.");
            } else {
                Alert.alert("Unable to schedule notification. Please use a physical device.");
            }
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={scheduleNotification}>
                <Text style={styles.buttonText}>Schedule Notification</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 24,

    },
    button: {
        backgroundColor: theme.colorBlack,
        padding: 12,
        borderRadius: 6,
    },
    buttonText: {
        color: theme.colorWhite,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});