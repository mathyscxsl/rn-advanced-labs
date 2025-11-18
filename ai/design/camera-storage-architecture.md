# Caméra & stockage – architecture

## Flux utilisateur

1. Galerie → bouton pour ouvrir la caméra.
2. Caméra → switch front/back, capture, sauvegarde locale.
3. Retour galerie → photo apparaît en tête (tri par date).
4. Détail photo → partager ou supprimer.

## Permissions & caméra

- `useCameraPermission`: demande la permission, état `loading/granted`, `openSettings` si refus.
- `CameraView` pour l’aperçu et `takePictureAsync()` pour la capture.

## Stockage fichiers

- Répertoire `documentDirectory/photos` (fallback `cacheDirectory`).
- Chaque photo: un fichier image + un JSON méta `{ id, uri, size, createdAt }`.
- Extensions supportées: jpg/jpeg/png/heic/webp (fallback jpg si inconnu).

## Hooks

- `usePhotoStorage`: `loadPhotos`, `addPhoto`, `removePhoto` (état local + services).
- `listPhotos`: lit les JSON, trie par `createdAt` décroissant.

## Partage & suppression

- Détail: partage via `expo-sharing` (test de disponibilité) et suppression (image + JSON).

## Points d’attention

- Robustesse I/O: try/catch, suppression idempotente.
- UI/UX: loaders pendant la capture, messages clairs si partage indisponible.
