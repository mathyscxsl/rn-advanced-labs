import * as Camera from "expo-camera";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useState } from "react";

export function useCameraPermission() {
    const [status, setStatus] = useState<Camera.PermissionStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const requestPermission = useCallback(async () => {
        setLoading(true);
        const { status } = await Camera.requestCameraPermissionsAsync();
        setStatus(status);
        setLoading(false);
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.getCameraPermissionsAsync();
            setStatus(status);
            setLoading(false);
        })();
    }, []);

    const openSettings = useCallback(() => {
        Linking.openSettings();
    }, []);

    return {
        status,
        loading,
        granted: status === "granted",
        requestPermission,
        openSettings,
    };
}