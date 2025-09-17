import * as Yup from "yup";

export const signupSchema = Yup.object({
  email: Yup.string()
    .email("Email invalide")
    .required("Email requis"),
  password: Yup.string()
    .min(6, "Au moins 6 caractères")
    .required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
  displayName: Yup.string()
    .min(2, "Au moins 2 caractères")
    .required("Nom d'affichage requis"),
  termsAccepted: Yup.boolean()
    .oneOf([true], "Vous devez accepter les conditions"),
});

export type SignupForm = Yup.InferType<typeof signupSchema>;
