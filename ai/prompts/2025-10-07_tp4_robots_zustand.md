---
Title: TP4 – Robots (Zustand + AsyncStorage)
Date: 2025-11-18T00:00:00Z
Owner: Mathys
Scope: `app/(main)/tp4-robots/*`, `store/robotStore.ts`, `components/RobotForm.tsx`
OutOfScope: SQLite/React Query
---

## Objectif

Mettre en place une gestion locale de robots (CRUD) avec Zustand persistant, UI liste + formulaire réutilisable.

## Contexte

- Store `useRobotsStore` avec persistance `AsyncStorage` (clé `robots-storage`).
- `RobotForm` partage la validation (Formik + Yup) et s’utilise en création/édition.

## Contraintes

- Unicité du nom (case-insensitive).
- Validation via `robotSchema` ou `Yup` dans le formulaire.
- UI: `FlatList` avec actions Éditer/Supprimer (confirmation).

## Étapes proposées à l'IA (agent)

1. Définir types et schémas (réutiliser `validation/robotSchema`).
2. Implémenter le store (create/update/remove/getById + persist).
3. Écrire `RobotForm` (Formik + Yup, chips de type, accessibilité).
4. Écrans: liste + navigation create/edit (Expo Router).
5. Auto-revue: vérifier sérialisation/persistance et UX (focus, erreurs).

## Critères d'acceptation

- CRUD fonctionnel et persistant après redémarrage.
- Unicité du nom respectée, erreurs claires.

## Plan de test minimal

- Création/édition/suppression enchaînées, persistance vérifiée.
- Conflits de nom → erreur bloquante.

## Risques & mitigations

- Incohérences de validation: centraliser les règles.
- Collisions d’IDs: utiliser `uuidv4()`.
