---
Title: TP5 – Robots DB (SQLite + React Query)
Date: 2025-11-18T00:00:00Z
Owner: Mathys
Scope: `db/*`, `services/robotRepo.ts`, `hooks/useRobotsQuery.ts`, `app/(main)/tp5-robots-db/*`, `services/backup.ts`
OutOfScope: Store Zustand
---

## Objectif

Passer à une persistance SQLite avec CRUD via repository, React Query pour data fetching/cache, et import/export JSON (partage possible).

## Contexte

- Migrations: `db/index.ts` (v1 table robots, v2 indexes, v3 archived).
- Repository: requêtes SQL dynamiques (recherche `q`, tri `sort`, pagination).
- UI: liste avec recherche/tri, écrans create/edit (réutilisent `RobotForm`).
- Backup: export JSON horodaté (SAF Android), import via Document Picker.

## Contraintes

- Pas de doublons (unicité par nom) à l’import.
- Tri whitelisté (colonnes autorisées) pour sécurité.
- Invalidation des queries après mutations.

## Étapes proposées à l'IA (agent)

1. Concevoir migrations et `openDb()` avec `PRAGMA user_version`.
2. Implémenter `robotRepo` (create/update/remove/getById/list) + garde-fous.
3. Brancher React Query (keys, useQuery/useMutation, invalidations).
4. Écrire UI liste/toolbar (search, tri) et brancher `RobotListItem`.
5. Ajouter backup import/export + partage.
6. Auto-revue: vérifier types, requêtes, chemins d’erreur.

## Critères d'acceptation

- CRUD SQLite OK, UI réactive (loading/refreshing).
- Export/import opérationnels (résumés: créés/ignorés).

## Plan de test minimal

- Create → présent en liste; Update → reflété; Delete → disparu.
- Export → fichier créé; Import → crée/ignore selon unicité.

## Risques & mitigations

- Incohérences schéma/SQL: charger dynamiquement les colonnes via PRAGMA.
- SAF Android: fallback document/cacheDirectory si refusée.
