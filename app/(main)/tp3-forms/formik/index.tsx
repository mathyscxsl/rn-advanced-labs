import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
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
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace("/(main)/");
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  const headerHeight = useHeaderHeight();

  const displayNameRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);

  const onSubmit = (values: SignupForm) => {
    Alert.alert("Formulaire soumis", JSON.stringify(values, null, 2));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="always"
      >
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={{ color: "#000" }}>
            Créer un compte
          </ThemedText>

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
                    touched.email && errors.email
                      ? styles.inputError
                      : undefined,
                  ]}
                  placeholder="ex: jean.dupont@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => displayNameRef.current?.focus()}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && !!errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <Text style={styles.label}>Nom d'utilisateur</Text>
                <TextInput
                  ref={displayNameRef}
                  style={[
                    styles.input,
                    touched.displayName && errors.displayName
                      ? styles.inputError
                      : undefined,
                  ]}
                  placeholder="ex: Jean Dupont"
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onChangeText={handleChange("displayName")}
                  onBlur={handleBlur("displayName")}
                  value={values.displayName}
                />
                {touched.displayName && !!errors.displayName && (
                  <Text style={styles.error}>{errors.displayName}</Text>
                )}

                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                  ref={passwordRef}
                  style={[
                    styles.input,
                    touched.password && errors.password
                      ? styles.inputError
                      : undefined,
                  ]}
                  placeholder="••••••"
                  secureTextEntry
                  textContentType="password"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {touched.password && !!errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  ref={confirmPasswordRef}
                  style={[
                    styles.input,
                    touched.confirmPassword && errors.confirmPassword
                      ? styles.inputError
                      : undefined,
                  ]}
                  placeholder="••••••"
                  secureTextEntry
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={() => handleSubmit()}
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
                      Haptics.selectionAsync();
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
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Créer mon compte</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
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
