# Navigation & architecture

Ce projet utilise Expo Router pour une structure Tabs + Stack, avec groupes de routes pour séparer la navigation principale `(main)` et le détail `(detail)`.

## Composants clés

- `app/_layout.tsx`: thème (clair/sombre), `QueryClientProvider`, restauration de route via `AsyncStorage` (clé `__last_pathname__`).
- `app/(main)/_layout.tsx`: Tabs visibles (Home, Profile, Robots, Robots DB, Galerie) + plusieurs écrans cachés (create/edit, caméra, détail photo).
- `app/(main)/(detail)/_layout.tsx`: Stack dédié au détail avec interception du back (replace vers `/(main)/`).

## Restauration de route

À chaque changement d’URL, l’app stocke `__last_pathname__`. Au prochain lancement, la route est restaurée via `router.replace(saved)`.

## Deep linking

- `app.json` définit `scheme: rnadvancedlabs`.
- Les groupes entre parenthèses n’apparaissent pas dans l’URL externe.

## Bonnes pratiques appliquées

- Écrans « action » cachés de la TabBar (create/edit/camera/detail) via `options: { href: null }`.
- Haptics sur les boutons d’onglet (HapticTab).
- Provider unique React Query à la racine.

## Points d’attention

- Éviter les boucles de navigation lors de la restauration (comparaison `saved !== pathname`).
- S’assurer que les écrans cachés restent accessibles via `router.push`.
