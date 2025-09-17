import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Salut👋</ThemedText>
      <ThemedText>Navigue sur les pages !👋</ThemedText>

      <Link href="/(detail)/1" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Page de l'ID 1</ThemedText>
        </TouchableOpacity>
      </Link>

      <Link href="/(detail)/42" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Page de l'ID 42</ThemedText>
        </TouchableOpacity>
      </Link>

      <Link href="/(detail)/45453" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Page de l'ID 45453</ThemedText>
        </TouchableOpacity>
      </Link>

      <Link href="/(main)/tp3-forms/formik" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Formulaire (Formik)</ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "tomato",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
