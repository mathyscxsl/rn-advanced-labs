import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RobotListItem from "../../../components/RobotListItem";
import {
  list as repoList,
  remove as repoRemove,
  RobotRow,
} from "../../../services/robotRepo";

export default function RobotsDbList() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<string>("name");
  const [data, setData] = useState<RobotRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const rows = await repoList({ q, sort });
      setData(rows);
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [q, sort]);

  const onDelete = async (id: string) => {
    try {
      await repoRemove(id);
      fetchData();
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    }
  };

  const sortedHint = useMemo(
    () =>
      sort === "name"
        ? "Tri: Nom"
        : sort === "-name"
        ? "Tri: Nom desc"
        : sort === "year"
        ? "Tri: Année"
        : sort === "-year"
        ? "Tri: Année desc"
        : `Tri: ${sort}`,
    [sort]
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TextInput
          placeholder="Rechercher..."
          placeholderTextColor="#666"
          value={q}
          onChangeText={setQ}
          style={styles.search}
        />
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSort(sort === "name" ? "-name" : "name")}
          >
            <Text style={styles.sortText}>Nom</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSort(sort === "year" ? "-year" : "year")}
          >
            <Text style={styles.sortText}>Année</Text>
          </TouchableOpacity>
          <Text style={styles.sortHint}>{sortedHint}</Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={fetchData}
        renderItem={({ item }) => (
          <RobotListItem
            robot={{
              id: item.id,
              name: item.name,
              label: item.label,
              year: item.year as any,
              type: item.type as any,
            }}
            onEdit={(id) => router.push(`/tp5-robots-db/edit/${id}`)}
            onDelete={onDelete}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun robot</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tp5-robots-db/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  toolbar: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  search: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#000",
    backgroundColor: "#fff",
  },
  sortRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  sortBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sortText: { color: "#000" },
  sortHint: { marginLeft: 8, color: "#333" },
  empty: { textAlign: "center", marginTop: 20, color: "#000" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 32, lineHeight: 32 },
});
