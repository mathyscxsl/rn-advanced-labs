import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import React, { useRef } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Yup from "yup";
import { useRobotsStore } from "../store/robotStore";
import { Robot } from "../validation/robotSchema";

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            Alert.alert("Succès", `Robot ${robotId ? "mis à jour" : "créé"} !`);
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
        }) => (
          <View style={styles.container}>
            <Text>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              returnKeyType="next"
              onSubmitEditing={() => labelRef.current?.focus()}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            <Text>Label</Text>
            <TextInput
              ref={labelRef}
              style={styles.input}
              placeholder="Label"
              value={values.label}
              onChangeText={handleChange("label")}
              onBlur={handleBlur("label")}
              returnKeyType="next"
              onSubmitEditing={() => yearRef.current?.focus()}
            />
            {touched.label && errors.label && (
              <Text style={styles.error}>{errors.label}</Text>
            )}

            <Text>Année</Text>
            <TextInput
              ref={yearRef}
              style={styles.input}
              placeholder="Année"
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

            <Text>Type</Text>
            <Picker
              selectedValue={values.type}
              onValueChange={(itemValue) => setFieldValue("type", itemValue)}
            >
              <Picker.Item label="Industrial" value="industrial" />
              <Picker.Item label="Service" value="service" />
              <Picker.Item label="Medical" value="medical" />
              <Picker.Item label="Educational" value="educational" />
              <Picker.Item label="Other" value="other" />
            </Picker>
            {touched.type && errors.type && (
              <Text style={styles.error}>{errors.type}</Text>
            )}

            <Button
              title={robotId ? "Mettre à jour" : "Créer"}
              onPress={handleSubmit as any}
              disabled={!isValid || isSubmitting}
            />
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default RobotForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});
