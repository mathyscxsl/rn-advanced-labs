import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { rhfSignupSchema, type RHFSignupForm } from "./validation/schema";

const defaultValues: RHFSignupForm = {
  email: "",
  password: "",
  confirmPassword: "",
  displayName: "",
  termsAccepted: false,
};

export default function RHFSignupScreen() {
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace("/(main)/");
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  const { control, handleSubmit, formState } = useForm<RHFSignupForm>({
    defaultValues,
    resolver: zodResolver(rhfSignupSchema),
    mode: "onBlur",
  });

  const { errors, isSubmitting } = formState;

  const onSubmit = (values: RHFSignupForm) => {
    Alert.alert("Formulaire soumis", JSON.stringify(values, null, 2));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: "#000" }}>
          Créer un compte
        </ThemedText>

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.email ? styles.inputError : undefined,
              ]}
              placeholder="ex: jean.dupont@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {!!errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Text style={styles.label}>Nom d'utilisateur</Text>
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.displayName ? styles.inputError : undefined,
              ]}
              placeholder="ex: Jean Dupont"
              autoCapitalize="words"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {!!errors.displayName && (
          <Text style={styles.error}>{errors.displayName.message}</Text>
        )}

        <Text style={styles.label}>Mot de passe</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.password ? styles.inputError : undefined,
              ]}
              placeholder="••••••"
              secureTextEntry
              textContentType="password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {!!errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword ? styles.inputError : undefined,
              ]}
              placeholder="••••••"
              secureTextEntry
              textContentType="password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {!!errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.labelInline}>
            J'accepte les conditions d'utilisation
          </Text>
          <Controller
            control={control}
            name="termsAccepted"
            render={({ field: { value, onChange } }) => (
              <Switch value={value} onValueChange={(v) => onChange(v)} />
            )}
          />
        </View>
        {!!errors.termsAccepted && (
          <Text style={styles.error}>
            {errors.termsAccepted.message as string}
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Créer mon compte</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#f0f0f0",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginLeft: Platform.OS === "ios" ? -8 : 0,
  },
  backText: {
    color: Platform.OS === "ios" ? "#007AFF" : "#000",
    fontSize: 17,
    fontWeight: Platform.OS === "ios" ? "400" : "bold",
  },
  label: {
    fontWeight: "600",
  },
  labelInline: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: "#e11d48",
  },
  error: {
    color: "#e11d48",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});
