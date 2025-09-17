import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Formik } from "formik";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signupSchema, type SignupForm } from "./validation/schema";

const initialValues: SignupForm = {
  email: "",
  password: "",
  confirmPassword: "",
  displayName: "",
  termsAccepted: false,
};

export default function FormikSignupScreen() {
  const onSubmit = (values: SignupForm) => {
    Alert.alert("Formulaire soumis", JSON.stringify(values, null, 2));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Créer un compte</ThemedText>

        <Formik<SignupForm>
          initialValues={initialValues}
          validationSchema={signupSchema}
          onSubmit={onSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            submitCount,
          }) => (
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email ? styles.inputError : undefined,
                ]}
                placeholder="ex: jean.dupont@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && !!errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <Text style={styles.label}>Nom d'utilisateur</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.displayName && errors.displayName
                    ? styles.inputError
                    : undefined,
                ]}
                placeholder="ex: Jean Dupont"
                autoCapitalize="words"
                onChangeText={handleChange("displayName")}
                onBlur={handleBlur("displayName")}
                value={values.displayName}
              />
              {touched.displayName && !!errors.displayName && (
                <Text style={styles.error}>{errors.displayName}</Text>
              )}

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.password && errors.password
                    ? styles.inputError
                    : undefined,
                ]}
                placeholder="••••••"
                secureTextEntry
                textContentType="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {touched.password && !!errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.confirmPassword && errors.confirmPassword
                    ? styles.inputError
                    : undefined,
                ]}
                placeholder="••••••"
                secureTextEntry
                textContentType="password"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
              />
              {touched.confirmPassword && !!errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <View style={styles.switchRow}>
                <Text style={styles.labelInline}>
                  J'accepte les conditions d'utilisation
                </Text>
                <Switch
                  value={values.termsAccepted}
                  onValueChange={(v) => {
                    setFieldValue("termsAccepted", v);
                  }}
                />
              </View>
              {!!errors.termsAccepted &&
                (touched.termsAccepted || submitCount > 0) && (
                  <Text style={styles.error}>{errors.termsAccepted}</Text>
                )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Créer mon compte</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
  form: {
    gap: 8,
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
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});
