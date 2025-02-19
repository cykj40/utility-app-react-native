/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFromStorage(key: string) {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function saveToStorage(key: string, data: any) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
}


