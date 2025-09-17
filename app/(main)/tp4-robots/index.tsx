import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RobotListItem from "../../../components/RobotListItem";
import { useRobotsStore } from "../../../store/robotStore";

const RobotListScreen = () => {
  const { robots, remove } = useRobotsStore();
  const router = useRouter();

  const sortedRobots = [...robots].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedRobots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RobotListItem
            robot={item}
            onEdit={(id) => router.push(`/tp4-robots/edit/${id}`)}
            onDelete={(id) => remove(id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun robot pour le moment</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tp4-robots/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RobotListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  empty: { textAlign: "center", marginTop: 20, color: "#555" },
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
