import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { create as repoCreate, list as repoList } from "./robotRepo";

export const EXPORT_FILE_NAME = "robots_export.json";

const ANDROID_SAF_DIR_KEY = "__robots_export_dir__";

function tsFileName(base: string) {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const name = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `${base}_${name}.json`;
}

export async function exportRobotsToJson() {
  const robots = await repoList({});
  const payload = { robots, exportedAt: new Date().toISOString() };
  const json = JSON.stringify(payload, null, 2);
  if (Platform.OS === "android") {
    try {
      let directoryUri = await AsyncStorage.getItem(ANDROID_SAF_DIR_KEY);
      if (!directoryUri) {
        const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (perm.granted) {
          directoryUri = perm.directoryUri;
          await AsyncStorage.setItem(ANDROID_SAF_DIR_KEY, directoryUri);
        }
      }
      if (directoryUri) {
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          tsFileName("robots_export"),
          "application/json"
        );
        await FileSystem.writeAsStringAsync(fileUri, json);
        return { uri: fileUri, count: robots.length };
      }
    } catch {}
  }
  const dir = ((FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? "") as string;
  const fileName = tsFileName("robots_export");
  const uri = `${dir}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, json);
  return { uri, count: robots.length };
}

export async function importRobotsFromJson() {
  const dir = ((FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? "") as string;
  const fixed = `${dir}${EXPORT_FILE_NAME}`;
  const fixedInfo = await FileSystem.getInfoAsync(fixed);
  if (fixedInfo.exists) return importRobotsFromUri(fixed);
  let files: string[] = [];
  try {
    files = await (FileSystem as any).readDirectoryAsync(dir);
  } catch {}
  const candidates = (files || []).filter((f) => f.startsWith("robots_export") && f.endsWith(".json"));
  if (candidates.length === 0) return { created: 0, skipped: 0, total: 0 };
  candidates.sort().reverse();
  const latest = candidates[0];
  const latestUri = `${dir}${latest}`;
  return importRobotsFromUri(latestUri);
}

export async function importRobotsFromUri(uri: string) {
  const content = await FileSystem.readAsStringAsync(uri);
  const parsed = JSON.parse(content);
  const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.robots) ? parsed.robots : [];
  if (!Array.isArray(items)) return { created: 0, skipped: 0, total: 0 };
  const current = await repoList({ includeArchived: false });
  const nameSet = new Set(current.map((r) => r.name.toLowerCase()));
  let created = 0;
  let skipped = 0;
  for (const it of items) {
    const name: string | undefined = it?.name;
    const label: string | undefined = it?.label;
    const year: number | undefined = it?.year;
    const type: string | undefined = it?.type;
    if (!name || !label || typeof year !== "number" || !type) {
      skipped++;
      continue;
    }
    if (nameSet.has(String(name).toLowerCase())) {
      skipped++;
      continue;
    }
    const id = uuidv4();
    const t = String(type) as any;
    await repoCreate({ id, name, label, year, type: t });
    nameSet.add(String(name).toLowerCase());
    created++;
  }
  return { created, skipped, total: items.length };
}

export async function pickAndImportRobots() {
  const result: any = await DocumentPicker.getDocumentAsync({ type: "application/json" });
  if (!result) return { created: 0, skipped: 0, total: 0 };
  if ((result as any).canceled || (result as any).type === "cancel") return { created: 0, skipped: 0, total: 0 };
  const asset = (result as any).assets?.[0] ?? result;
  const uri: string | undefined = asset?.uri;
  if (!uri) return { created: 0, skipped: 0, total: 0 };
  return importRobotsFromUri(uri);
}

export async function shareExport(uri: string) {
  const available = await Sharing.isAvailableAsync();
  if (!available) return { shared: false as const, reason: "not_available" as const };
  let shareUri = uri;
  if (!uri.startsWith("file://")) {
    const cacheDir = ((FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory ?? "") as string;
    const tmp = `${cacheDir}${tsFileName("robots_export_share")}`;
    const content = await FileSystem.readAsStringAsync(uri);
    await FileSystem.writeAsStringAsync(tmp, content);
    shareUri = tmp;
  }
  await Sharing.shareAsync(shareUri, { mimeType: "application/json", dialogTitle: "Partager le fichier robots" });
  return { shared: true as const };
}

export async function exportAndShareRobots() {
  const res = await exportRobotsToJson();
  await shareExport(res.uri);
  return res;
}
