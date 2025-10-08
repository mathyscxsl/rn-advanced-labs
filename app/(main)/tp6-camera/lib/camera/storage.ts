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

function getExtensionFromUri(uri: string): string {
    try {
        const clean = uri.split("?")[0];
        const match = clean.match(/\.([a-zA-Z0-9]+)$/);
        const ext = (match?.[1] || "jpg").toLowerCase();
        // Allow only known common image extensions; default to jpg
        if (["jpg", "jpeg", "png", "heic", "webp"].includes(ext)) return ext;
        return "jpg";
    } catch {
        return "jpg";
    }
}

export async function savePhoto(uri: string): Promise<Photo> {
    await ensurePhotoDirExists();

    const id = `photo_${Date.now()}`;
    const ext = getExtensionFromUri(uri);
    const fileName = `${id}.${ext}`;
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
    // Try to read metadata to get the exact image URI to delete
    try {
        const json = await FileSystem.readAsStringAsync(`${PHOTOS_DIR}/${id}.json`);
        const meta = JSON.parse(json) as Photo;
        if (meta?.uri) {
            await FileSystem.deleteAsync(meta.uri, { idempotent: true });
        } else {
            // Fallback to jpg if no uri
            await FileSystem.deleteAsync(`${PHOTOS_DIR}/${id}.jpg`, { idempotent: true });
        }
    } catch {
        // If metadata missing, attempt common extensions
        for (const ext of ["jpg", "jpeg", "png", "heic", "webp"]) {
            try { await FileSystem.deleteAsync(`${PHOTOS_DIR}/${id}.${ext}`, { idempotent: true }); } catch {}
        }
    } finally {
        try { await FileSystem.deleteAsync(`${PHOTOS_DIR}/${id}.json`, { idempotent: true }); } catch {}
    }
}