/* eslint-disable prettier/prettier */
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { intervalToDuration, Duration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";


const frequency = 2 * 7 * 24 * 60 * 60 * 1000;

export const countdownStorageKey = "taskly-countdown";

export type PersistedCountdownState = {
    currentNotificationId: string | undefined;
    completedAtTimestamps: number[];
}



type CountdownStatus = {
    isOverdue: boolean;
    distance: Duration;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function CounterScreen() {
    const confettiRef = useRef<ConfettiCannon>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [countdownState, setCountdownState] = useState<PersistedCountdownState | null>(null);
    const [status, setStatus] = useState<CountdownStatus>({
        isOverdue: false,
        distance: {},
    });
    const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

    useEffect(() => {
        const init = async () => {
            const value = await getFromStorage(countdownStorageKey);
            setCountdownState(value);
            setIsLoading(false);
        }
        init();
    }, []);


    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [permission, setPermission] = useState<string | null>(null);
    useEffect(() => {
        const intervalId = setInterval(() => {
            const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now();
            if (lastCompletedTimestamp) {
                setIsLoading(false);
            }
            const isOverdue = isBefore(timestamp, Date.now());
            const distance = intervalToDuration({
                start: isOverdue ? timestamp : Date.now(),
                end: isOverdue ? Date.now() : timestamp
            });

            setStatus({ isOverdue, distance });
            setSecondsElapsed(val => val + 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [lastCompletedTimestamp]);

    const scheduleNotification = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        confettiRef.current?.start();
        const result = await registerForPushNotificationsAsync();
        setPermission(result);
        if (result === "granted") {
            if (countdownState?.currentNotificationId) {
                await Notifications.cancelScheduledNotificationAsync(countdownState.currentNotificationId);
            }
            const pushNotificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "the thing is due!",
                },
                trigger: null,
            });
            const newCountdownState = {
                currentNotificationId: pushNotificationId,
                completedAtTimestamps: [Date.now(), ...(countdownState?.completedAtTimestamps ?? [])],
            }
            await saveToStorage(countdownStorageKey, newCountdownState);
            setCountdownState(newCountdownState);
        } else {
            if (Device.isDevice) {
                Alert.alert("Unable to schedule notification. Enable the notification permission for expo in settings.");
            } else {
                Alert.alert("Unable to schedule notification. Please use a physical device.");
            }
        }
    }

    if (isLoading) {
        return (
            <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size="large" color={theme.colorBlack} />
            </View>
        )
    }

    return (
        <View style={[styles.container, status.isOverdue ? styles.containerLate : undefined]}>
            {status.isOverdue ? (
                <Text style={[styles.heading, styles.whiteText]}>Thing Overdue by</Text>
            ) : (
                <Text style={[styles.heading, styles.whiteText]}>Thing due in...</Text>
            )}
            <View style={styles.row}>
                <TimeSegment
                    number={status.distance.days ?? 0}
                    unit="days"
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
                <TimeSegment
                    number={status.distance.hours ?? 0}
                    unit="hours"
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
                <TimeSegment
                    number={status.distance.minutes ?? 0}
                    unit="minutes"
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
                <TimeSegment
                    number={status.distance.seconds ?? 0}
                    unit="seconds"
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={scheduleNotification}
            >
                <Text style={[styles.buttonText, status.isOverdue ? styles.whiteText : undefined]}>Ive Done the Thing</Text>
            </TouchableOpacity>
            <ConfettiCannon count={200} origin={{ x: Dimensions.get("window").width / 2, y: 0 }} ref={confettiRef} fadeOut />

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
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    containerLate: {
        backgroundColor: theme.colorRed,
    },
    whiteText: {
        color: theme.colorWhite,
    },
    activityIndicatorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colorWhite,
    },
});