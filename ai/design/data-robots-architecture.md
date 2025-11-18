# Données Robots – architecture

Deux implémentations en fonction des différents TP's : un store local persistant (TP4) et une base SQLite (TP5) avec React Query.

## TP4 – Store Zustand

- Store `useRobotsStore` (create/update/remove/getById) + persist `AsyncStorage`.
- Validation par `robotSchema` (Yup) et garde-fous d’unicité sur `name`.
- UI: `RobotForm` mutualisé (Formik+Yup) pour création/édition.

## TP5 – SQLite + React Query

- Migrations versionnées (`PRAGMA user_version`):
  - v1: table `robots`.
  - v2: index sur `name`, `year`.
  - v3: colonne `archived`.
- Repository `services/robotRepo.ts`:
  - `create`, `update` (met à jour `updated_at` si dispo), `remove`, `list` (q, sort, limit/offset, includeArchived), `getById`.
  - Découverte dynamique du schéma via `PRAGMA table_info` pour compatibilité.
- Côté UI: `hooks/useRobotsQuery.ts` expose queries/mutations et invalide `keys.all`.

## Import/Export

- `services/backup.ts` exporte en JSON horodaté (SAF Android si accord), partage via `expo-sharing`.
- Import depuis picker ou dernier export stocké; évite doublons (unicité par nom).

## Points d’attention

- Whitelisting des colonnes de tri.
- Conversions de type (year, type) entre UI et DB.
- Gestion des erreurs (try/catch et alertes utilisateur).
