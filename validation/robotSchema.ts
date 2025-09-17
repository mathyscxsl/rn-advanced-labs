import * as Yup from "yup";

const currentYear = new Date().getFullYear();

export const robotSchema = Yup.object().shape({
  id: Yup.string().uuid("ID invalide").required(),
  name: Yup.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .required("Le nom est obligatoire"),
  label: Yup.string()
    .min(3, "Le label doit contenir au moins 3 caractères")
    .required("Le label est obligatoire"),
  year: Yup.number()
    .typeError("L'année doit être un nombre")
    .integer("L'année doit être un entier")
    .min(1950, "Année minimale 1950")
    .max(currentYear, `Année maximale ${currentYear}`)
    .required("L'année est obligatoire"),
  type: Yup.mixed<"industrial" | "service" | "medical" | "educational" | "other">()
    .oneOf(["industrial", "service", "medical", "educational", "other"], "Type invalide")
    .required("Le type est obligatoire"),
});

export type Robot = Yup.InferType<typeof robotSchema>;