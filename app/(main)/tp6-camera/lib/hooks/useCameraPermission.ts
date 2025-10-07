import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { Linking } from "react-native";

export function useCameraPermission() {
    const [granted, setGranted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setGranted(status === "granted");
            } catch (err) {
                console.error("Erreur permissions caméra:", err);
                setGranted(false);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const openSettings = () => {
        Linking.openSettings();
    };

    return { granted, loading, openSettings };
}
