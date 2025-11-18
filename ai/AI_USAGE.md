# Usage de l'IA dans le projet

Ce dossier documente l'utilisation de l'IA dans le projet de TP React Native.

## Principes non‑négociables à respecter

- Vous restez propriétaire du code et comprenez chaque ligne.
- L'IA est un agent assisté et orchestré (décomposer, cadrer, vérifier, itérer).
- Traçabilité obligatoire: tous les prompts et conceptions sont versionnés ici.
- Qualité mesurée: build, lint, types et tests doivent passer.
- Confidentialité: aucune donnée sensible dans les prompts.

## Traçabilité & arborescence

- `ai/prompts/`: tous les prompts utilisés, datés, avec métadonnées (objectif, contexte, contraintes, livrables, checklists).
- `ai/design/`: conceptions et arbitrages techniques rédigés/affinés avec l'IA.
- `ai/AI_USAGE.md`: ce document.

## Qualité & vérifications

- Build: l'application Expo doit démarrer sans erreur.
- Lint & types: `eslint` et `tsc` propres.
- Tests: zones impactées par l'IA doivent avoir des tests minimaux (happy path + 1 edge). Si ajout futur, référencer le plan de test dans le prompt/design.
- Revue humaine: validation du code et de la pertinence fonctionnelle.

## Prompts par TP (références)

- TP1 – Profile Card: prompt `ai/prompts/2025-11-18_tp1_profile-card.md`.
- TP3 – Formik + Yup: prompt `ai/prompts/2025-11-18_tp3_formik.md`.
- TP3 – RHF + Zod: prompt `ai/prompts/2025-11-18_tp3_rhf.md`.
- TP4 – Robots (Zustand): prompt `ai/prompts/2025-11-18_tp4_robots_zustand.md`.
- TP5 – Robots DB (SQLite + React Query): prompt `ai/prompts/2025-11-18_tp5_robots_db.md`.
- TP6 – Caméra (galerie/capture/détail): prompt `ai/prompts/2025-11-18_tp6_camera.md`.

## Confidentialité

- Ne jamais inclure de secrets, clés API, identifiants ou données privées.
- Anonymiser les données personnelles (noms, emails) si nécessaire.
