import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deletePhoto, getPhoto } from "../../tp6-camera/lib/camera/storage";
import { Photo } from "../../tp6-camera/lib/camera/types";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getPhoto(id).then((p) => setPhoto(p));
    }
  }, [id]);

  const handleDelete = () => {
    if (!photo) return;
    Alert.alert(
      "Supprimer la photo",
      "Voulez-vous vraiment supprimer cette photo ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deletePhoto(photo.id);
            Alert.alert("Photo supprimée");
            router.back();
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!photo) return;
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert(
          "Partage indisponible",
          "Le partage n'est pas disponible sur cet appareil."
        );
        return;
      }
      await Sharing.shareAsync(photo.uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Partager la photo",
      });
    } catch (err) {
      console.warn("Erreur partage :", err);
    }
  };

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photo.uri }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Partager</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.info}>Taille : {photo.size} bytes</Text>
      <Text style={styles.info}>
        Créée le : {new Date(photo.createdAt).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { flex: 1, width: "100%" },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 12,
  },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
  info: { color: "#fff", marginVertical: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
