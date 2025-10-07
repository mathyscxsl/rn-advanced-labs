import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCameraPermission } from "../tp6-camera/lib/hooks/useCameraPermission";
import { usePhotoStorage } from "../tp6-camera/lib/hooks/usePhotoStorage";

export default function CameraScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isCapturing, setIsCapturing] = useState(false);
  const router = useRouter();

  const { granted, loading, requestPermission, openSettings } = useCameraPermission();
  const { addPhoto } = usePhotoStorage();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement de la caméra...</Text>
      </View>
    );
  }

  if (!granted) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center", marginBottom: 12 }}>
          L’accès à la caméra est nécessaire pour prendre des photos.
        </Text>
        <TouchableOpacity onPress={openSettings} style={styles.button}>
          <Text style={styles.buttonText}>Ouvrir les réglages</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSwitchCamera = () => {
    setType((prev) => (prev === CameraType.back ? CameraType.front : CameraType.back));
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync();
      await addPhoto(photo.uri); // mise à jour automatique de la galerie
      Alert.alert("Photo enregistrée !");
      router.back(); // retour vers la galerie
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de prendre la photo");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef} ratio="16:9" />

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleSwitchCamera} style={styles.buttonSmall}>
          <Text style={styles.buttonText}>⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTakePhoto} style={styles.shutter}>
          {isCapturing ? <ActivityIndicator color="#fff" /> : <View style={styles.innerShutter} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  innerShutter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  buttonSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "600" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});