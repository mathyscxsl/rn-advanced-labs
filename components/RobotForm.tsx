import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useRobotsStore } from "../store/robotStore";
import { Robot } from "../validation/robotSchema";

const typeOptions: { label: string; value: Robot["type"] }[] = [
  { label: "Industrial", value: "industrial" },
  { label: "Service", value: "service" },
  { label: "Medical", value: "medical" },
  { label: "Educational", value: "educational" },
  { label: "Other", value: "other" },
];

interface RobotFormProps {
  initialValues?: Partial<Robot>;
  onSubmitSuccess?: () => void;
  robotId?: string;
}

const RobotForm: React.FC<RobotFormProps> = ({
  initialValues,
  onSubmitSuccess,
  robotId,
}) => {
  const { create, update, getById, robots } = useRobotsStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const robot = robotId ? getById(robotId) : null;

  const formInitialValues = robot || {
    name: "",
    label: "",
    year: "",
    type: "industrial",
  };

  const labelRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            enableReinitialize
            initialValues={formInitialValues}
            validationSchema={Yup.object({
              name: Yup.string()
                .min(2, "Le nom doit contenir au moins 2 caractères")
                .required("Nom obligatoire")
                .test(
                  "unique",
                  "Un robot avec ce nom existe déjà",
                  (value) =>
                    !robots.some(
                      (r) =>
                        r.name.toLowerCase() === value?.toLowerCase() &&
                        r.id !== robotId
                    )
                ),
              label: Yup.string()
                .min(3, "Le label doit contenir au moins 3 caractères")
                .required("Label obligatoire"),
              year: Yup.number()
                .typeError("L'année doit être un nombre")
                .integer("L'année doit être un entier")
                .min(1950, "Année minimale 1950")
                .max(new Date().getFullYear(), "Année maximale autorisée")
                .required("Année obligatoire"),
              type: Yup.mixed<Robot["type"]>()
                .oneOf(
                  ["industrial", "service", "medical", "educational", "other"],
                  "Type invalide"
                )
                .required("Type obligatoire"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                if (robotId) {
                  update(robotId, values as Omit<Robot, "id">);
                } else {
                  create(values as Omit<Robot, "id">);
                }
                setSubmitting(false);
                Alert.alert(
                  "Succès",
                  `Robot ${robotId ? "mis à jour" : "créé"} !`
                );
                onSubmitSuccess?.();
              } catch (err: any) {
                setSubmitting(false);
                Alert.alert("Erreur", err.message);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              isSubmitting,
              setFieldValue,
            }) => {
              const disabled = !isValid || isSubmitting;
              return (
                <View style={styles.card}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nom du robot"
                      placeholderTextColor="#666"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      returnKeyType="next"
                      onSubmitEditing={() => labelRef.current?.focus()}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.error}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Label</Text>
                    <TextInput
                      ref={labelRef}
                      style={styles.input}
                      placeholder="Label public"
                      placeholderTextColor="#666"
                      value={values.label}
                      onChangeText={handleChange("label")}
                      onBlur={handleBlur("label")}
                      returnKeyType="next"
                      onSubmitEditing={() => yearRef.current?.focus()}
                    />
                    {touched.label && errors.label && (
                      <Text style={styles.error}>{errors.label}</Text>
                    )}
                  </View>

                  <View style={styles.inlineRow}>
                    <View style={[styles.fieldGroup, styles.inlineCol]}>
                      <Text style={styles.label}>Année</Text>
                      <TextInput
                        ref={yearRef}
                        style={styles.input}
                        placeholder="2020"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={values.year?.toString()}
                        onChangeText={(text) =>
                          setFieldValue("year", text ? parseInt(text, 10) : "")
                        }
                        onBlur={handleBlur("year")}
                        returnKeyType="done"
                      />
                      {touched.year && errors.year && (
                        <Text style={styles.error}>{errors.year}</Text>
                      )}
                    </View>

                    <View style={[styles.fieldGroup, styles.inlineCol]}>
                      <Text style={styles.label}>Type</Text>
                      <View style={styles.chipsContainer}>
                        {typeOptions.map((opt) => {
                          const selected = values.type === opt.value;
                          return (
                            <Pressable
                              key={opt.value}
                              onPress={() => setFieldValue("type", opt.value)}
                              accessibilityRole="button"
                              accessibilityState={{ selected }}
                              style={({ pressed }) => [
                                styles.chip,
                                styles.chipFullWidth,
                                selected && styles.chipSelected,
                                pressed && { opacity: 0.85 },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipText,
                                  selected && styles.chipTextSelected,
                                ]}
                              >
                                {opt.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      {touched.type && errors.type && (
                        <Text style={styles.error}>{errors.type}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => router.back()}
                      style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && { opacity: 0.7 },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Annuler et revenir en arrière"
                    >
                      <Text style={styles.secondaryButtonText}>Annuler</Text>
                    </Pressable>

                    <Pressable
                      onPress={handleSubmit as any}
                      disabled={disabled}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        (pressed || disabled) && { opacity: 0.7 },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={
                        robotId ? "Mettre à jour le robot" : "Créer le robot"
                      }
                    >
                      <Text style={styles.primaryButtonText}>
                        {robotId ? "Mettre à jour" : "Créer"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RobotForm;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#111",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    borderRadius: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  inlineCol: {
    flex: 1,
  },
  chipsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  chipFullWidth: {
    width: "100%",
  },
  chipSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  chipText: {
    color: "#111",
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#fff",
  },
  error: {
    color: "#d00",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: "#007bff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 52,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
});
