import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Robot } from "../validation/robotSchema";

interface Props {
  robot: Robot;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RobotListItem: React.FC<Props> = ({ robot, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert("Supprimer le robot", `Voulez-vous supprimer ${robot.name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => onDelete(robot.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{robot.name}</Text>
        <Text style={styles.details}>
          {robot.type} • {robot.year}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(robot.id)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Éditer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.button, styles.delete]}
        >
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RobotListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#000" },
  details: { color: "#000" },
  actions: { flexDirection: "row" },
  button: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  delete: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff" },
});
