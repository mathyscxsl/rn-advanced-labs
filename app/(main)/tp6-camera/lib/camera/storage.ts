import * as FileSystem from "expo-file-system/legacy";
import { Photo } from "./types";

const DOC_DIR = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? "file:///";
const PHOTOS_DIR = `${DOC_DIR}photos`;

export async function ensurePhotoDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
}

export async function savePhoto(uri: string): Promise<Photo> {
    await ensurePhotoDirExists();

    const id = `photo_${Date.now()}`;
    const fileName = `${id}.jpg`;
    const dest = `${PHOTOS_DIR}/${fileName}`;

    await FileSystem.copyAsync({ from: uri, to: dest });

    const info = await FileSystem.getInfoAsync(dest);
    const size = info.exists && !info.isDirectory && typeof (info as any).size === "number" ? (info as any).size : 0;

    const photo: Photo = {
        id,
        uri: dest,
        createdAt: Date.now(),
        size,
    };

    await FileSystem.writeAsStringAsync(
        `${PHOTOS_DIR}/${id}.json`,
        JSON.stringify(photo)
    );

    return photo;
}

export async function listPhotos(): Promise<Photo[]> {
    await ensurePhotoDirExists();
    const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);

    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const photos: Photo[] = [];

    for (const f of jsonFiles) {
        try {
            const content = await FileSystem.readAsStringAsync(`${PHOTOS_DIR}/${f}`);
            const photo = JSON.parse(content) as Photo;
            photos.push(photo);
        } catch (e) {
            console.warn("Erreur lecture photo:", f, e);
        }
    }

    photos.sort((a, b) => b.createdAt - a.createdAt);
    return photos;
}

export async function getPhoto(id: string): Promise<Photo | null> {
    try {
        const json = await FileSystem.readAsStringAsync(`${PHOTOS_DIR}/${id}.json`);
        return JSON.parse(json) as Photo;
    } catch {
        return null;
    }
}

export async function deletePhoto(id: string): Promise<void> {
    await FileSystem.deleteAsync(`${PHOTOS_DIR}/${id}.jpg`, { idempotent: true });
    await FileSystem.deleteAsync(`${PHOTOS_DIR}/${id}.json`, { idempotent: true });
}