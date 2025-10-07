import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { listPhotos } from "../tp6-camera/lib/camera/storage";
import { Photo } from "../tp6-camera/lib/camera/types";

const NUM_COLUMNS = 3;

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadPhotos = useCallback(async () => {
    setRefreshing(true);
    const data = await listPhotos();
    setPhotos(data);
    setRefreshing(false);
  }, []);

  // Rafraîchit automatiquement quand on revient à la galerie
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  const handlePhotoPress = (id: string) => {
    router.push(`/TP6-camera/detail/${id}`);
  };

  const handleTakePhoto = () => {
    router.push("/TP6-camera/camera");
  };

  const renderItem = ({ item }: { item: Photo }) => {
    const size = Dimensions.get("window").width / NUM_COLUMNS - 4;
    return (
      <TouchableOpacity onPress={() => handlePhotoPress(item.id)} style={{ margin: 2 }}>
        <Image
          source={{ uri: item.uri }}
          style={{ width: size, height: size, borderRadius: 8, backgroundColor: "#ccc" }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {photos.length === 0 && !refreshing && (
        <View style={styles.empty}>
          <Text>Aucune photo pour l'instant</Text>
        </View>
      )}

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPhotos} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.fab} onPress={handleTakePhoto}>
        <Text style={styles.fabText}>📸</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: { fontSize: 28, color: "#fff" },
});