import { useCallback, useState } from "react";
import { deletePhoto, listPhotos, savePhoto as savePhotoService } from "../camera/storage";
import { Photo } from "../camera/types";

export function usePhotoStorage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(false);

    const loadPhotos = useCallback(async () => {
        setLoading(true);
        const data = await listPhotos();
        setPhotos(data);
        setLoading(false);
    }, []);

    const addPhoto = useCallback(async (uri: string) => {
        setLoading(true);
        const saved = await savePhotoService(uri);
        setPhotos((prev) => [saved, ...prev]);
        setLoading(false);
        return saved;
    }, []);

    const removePhoto = useCallback(async (id: string) => {
        setLoading(true);
        await deletePhoto(id);
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setLoading(false);
    }, []);

    return {
        photos,
        loading,
        loadPhotos,
        addPhoto,
        removePhoto,
    };
}