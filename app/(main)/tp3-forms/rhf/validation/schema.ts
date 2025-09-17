import { z } from "zod";

export const rhfSignupSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Au moins 6 caractères"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
    displayName: z.string().min(2, "Au moins 2 caractères"),
    termsAccepted: z
      .boolean()
      .refine((v) => v === true, {
        message: "Vous devez accepter les conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

export type RHFSignupForm = z.infer<typeof rhfSignupSchema>;
