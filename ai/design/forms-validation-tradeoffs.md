# Formulaires & validations – arbitrages

Comparaison des approches Formik+Yup et RHF+Zod telles qu’illustrées dans le projet.

## Formik + Yup

- Inputs contrôlés (`value`, `onChangeText`, `onBlur`).
- Gestion explicite `touched`/`errors`.
- Schémas Yup avec `Yup.InferType` pour typer les valeurs.
- Verbosité plus élevée mais clarté pédagogique.

## RHF + Zod

- Inputs non contrôlés + `Controller` pour RN.
- `zodResolver` → types, messages et validations synchronisés.
- Moins de re-rendus (subscriptions) → perfs meilleures.

## DX & perfs

- Petits formulaires: Formik est très lisible.
- Formulaires moyens/grands: RHF+Zod recommandé (DX typée + perfs).

## Accessibilité & UX

- Labels explicites, messages FR homogènes.
- Navigation clavier/focus (submit editing, `keyboardShouldPersistTaps`).

## Recommandations dans ce dépôt

- Centraliser les règles (schémas) pour éviter divergences.
- Factoriser les champs réutilisables (Field) si la verbosité augmente.
- Mesurer les re-rendus (dev only) pour comparer concrètement.
