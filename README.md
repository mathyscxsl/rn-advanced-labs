# RN Advanced Labs

Ce dépôt regroupe plusieurs TP progressifs autour d’Expo Router, formulaires, state management, persistance locale (SQLite), fichiers, permissions et caméra.

Sommaire rapide par TP:

- TP1 – Profile Card (UI + état local)
- TP3 – Formulaires (Formik + Yup) et (RHF + Zod)
- TP4 – Robots (Zustand, persistance AsyncStorage)
- TP5 – Robots DB (SQLite + React Query, import/export JSON)
- TP6 – Caméra (galerie, capture, détail + partage)

## Navigation, persistance et UX mobile

- Persistance de la dernière page visitée: `AsyncStorage` enregistre `__last_pathname__` à chaque changement d’URL et la route est restaurée au démarrage via `router.replace(savedPath)` (voir `app/_layout.tsx`).
- Détail (groupe caché): interception `beforeRemove` pour remplacer le back natif par un retour direct à l’accueil (`router.replace("/(main)/")`, voir `app/(main)/(detail)/_layout.tsx`).
- Onglets (Tabs): Home, Profile, Robots, Robots DB, Galerie (voir `app/(main)/_layout.tsx`).
- Provider app: `ThemeProvider` (clair/sombre) + `QueryClientProvider` (React Query).

## Packages installés (sélection)

- Navigation/Expo: expo, expo-router, @react-navigation/\*, expo-linking, expo-status-bar, expo-splash-screen, expo-system-ui, expo-constants, expo-font, expo-image, expo-web-browser, expo-haptics, expo-symbols.
- UI/gesture: react-native-gesture-handler, react-native-reanimated, react-native-screens, react-native-safe-area-context, @expo/vector-icons.
- State/persistance: @react-native-async-storage/async-storage, zustand, uuid.
- Données: expo-sqlite, @tanstack/react-query.
- Fichiers & partage: expo-file-system, expo-document-picker, expo-sharing.
- Caméra & médias: expo-camera.
- Formulaires/validation: formik, yup, react-hook-form, zod, @hookform/resolvers.
- Dev: typescript, eslint, eslint-config-expo.

Notes de config:

- `app.json`: `scheme: "rnadvancedlabs"` (deep link), `experiments.typedRoutes: true` (types de routes).
- `package.json`: `main: "expo-router/entry"`.

---

## TP1 – Profile Card

- Fichier: `app/(main)/tp1-profile-card/index.tsx`
- Fonctionnalités:
  - Carte profil simple: avatar, nom, compteur « followers » qui s’incrémente automatiquement.
  - Bouton Follow/Unfollow qui met à jour l’état local.
- Accès:
  - Onglet « Profile » ou deep link externe `/tp1-profile-card`.

## TP3 – Formulaires

- Formik + Yup: `app/(main)/tp3-forms/formik/index.tsx`
- RHF + Zod: `app/(main)/tp3-forms/rhf/index.tsx`
- Détails communs:
  - Chaque écran a un bouton de switch (⇄) dans le header pour basculer rapidement vers l’autre.
  - Démonstration des patterns contrôlé (Formik) vs non contrôlé/Controller (RHF), avec schémas Yup/Zod.
- Accès:
  - Liens depuis Home; deep links `/tp3-forms/formik` et `/tp3-forms/rhf`.

## TP4 – Robots (Zustand + AsyncStorage)

- Écrans:
  - Liste: `app/(main)/tp4-robots/index.tsx`
  - Création: `app/(main)/tp4-robots/create.tsx`
  - Édition: `app/(main)/tp4-robots/edit/[id].tsx`
- Stockage: `zustand` avec persistance `AsyncStorage` (clé `robots-storage`, voir `store/robotStore.ts`).
- UI: `FlatList` + `RobotListItem` (édition/suppression avec confirmation) + FAB « + ».
- Formulaire: `components/RobotForm.tsx` (Formik + Yup, validation, choix de type via chips).
- Accès:
  - Onglet « Robots » (`/tp4-robots`), puis navigation interne pour créer/éditer.

## TP5 – Robots DB (SQLite + React Query)

- Écrans:
  - Liste: `app/(main)/tp5-robots-db/index.tsx` (recherche `q`, tri `name`/`year` asc/desc).
  - Création: `app/(main)/tp5-robots-db/create.tsx`
  - Édition: `app/(main)/tp5-robots-db/edit/[id].tsx`
- Données:
  - Base `expo-sqlite` + migrations (`db/index.ts`):
    - v1: table `robots` (id, name, label, year, type)
    - v2: index sur `name`, `year`
    - v3: colonne `archived` (par défaut 0)
  - Repository (`services/robotRepo.ts`): CRUD, list avec recherche/tri/pagination, gestion conditionnelle de `archived` et `updated_at`.
  - React Query (`hooks/useRobotsQuery.ts`): requêtes et mutations avec invalidation automatique.
- Import/export:
  - `services/backup.ts`: export JSON (nom horodaté), stockage dans `documentDirectory` (ou SAF Android), partage via `expo-sharing`.
  - Import depuis fichier choisi (Document Picker) ou depuis le dernier export local trouvé; garde-fous (unicité par nom, champs requis).
- Accès:
  - Onglet « Robots DB » (`/tp5-robots-db`) + pages de création/édition.

## TP6 – Caméra (galerie, capture, détail)

- Écrans:
  - Galerie: `app/(main)/tp6-camera/index.tsx` (grid 3 colonnes, pull-to-refresh, FAB pour capturer).
  - Caméra: `app/(main)/tp6-camera/camera.tsx` (permission, switch front/back, capture, enregistrement local).
  - Détail: `app/(main)/tp6-camera/detail/[id].tsx` (affichage, suppression, partage via `expo-sharing`).
- Stockage:
  - Fichiers sous `<documentDirectory>/photos` avec méta `*.json` par photo (voir `app/(main)/tp6-camera/lib/camera/storage.ts`).
  - Hooks: `useCameraPermission` (demande + redirection vers réglages), `usePhotoStorage` (charger/ajouter/supprimer, état local).
- Accès:
  - Onglet « Galerie » (`/tp6-camera`) + écrans internes cachés dans les Tabs (`/tp6-camera/camera`, `/tp6-camera/detail/:id`).

---

## Arborescence (extrait `app/`)

```sh
rn-advanced-labs
└── app
    ├── _layout.tsx                 # Root Stack + persistance de route + React Query
    ├── (main)/                     # Groupe principal (Tabs)
    │   ├── _layout.tsx             # Tabs: Home, Profile, Robots, Robots DB, Galerie
    │   ├── index.tsx               # Home
    │   ├── tp1-profile-card/
    │   │   └── index.tsx           # TP1
    │   ├── (detail)/
    │   │   ├── _layout.tsx         # Back remplacé ⇒ accueil
    │   │   └── [id].tsx            # Détail dynamique
    │   ├── tp3-forms/
    │   │   ├── formik/
    │   │   │   ├── _layout.tsx
    │   │   │   └── index.tsx       # TP3 (Formik)
    │   │   └── rhf/
    │   │       ├── _layout.tsx
    │   │       └── index.tsx       # TP3 (RHF)
    │   ├── tp4-robots/
    │   │   ├── index.tsx           # TP4 liste
    │   │   ├── create.tsx          # TP4 création
    │   │   └── edit/[id].tsx       # TP4 édition
    │   ├── tp5-robots-db/
    │   │   ├── index.tsx           # TP5 liste
    │   │   ├── create.tsx          # TP5 création
    │   │   └── edit/[id].tsx       # TP5 édition
    │   └── tp6-camera/
    │       ├── index.tsx           # TP6 galerie
    │       ├── camera.tsx          # TP6 capture
    │       └── detail/[id].tsx     # TP6 détail
```

Rappel Expo Router: les groupes entre parenthèses (ex: `(main)`, `(detail)`) n’apparaissent pas dans l’URL externe; ils structurent la navigation (Tabs/Stack).

---

## Table des routes

| Nom (écran)               | Fichier                                  | Type                 | URL externe (deep link)   | Href interne (app)               | Paramètres   |
| ------------------------- | ---------------------------------------- | -------------------- | ------------------------- | -------------------------------- | ------------ |
| Home                      | `app/(main)/index.tsx`                   | Tab                  | `/`                       | `/(main)` ou `/`                 | —            |
| Profile Card (TP1)        | `app/(main)/tp1-profile-card/index.tsx`  | Tab                  | `/tp1-profile-card`       | `/(main)/tp1-profile-card`       | —            |
| Détail                    | `app/(main)/(detail)/[id].tsx`           | Stack (caché)        | `/:id`                    | `/(detail)/:id`                  | `id: string` |
| Formulaire (Formik) (TP3) | `app/(main)/tp3-forms/formik/index.tsx`  | Page (cachée Tab)    | `/tp3-forms/formik`       | `/(main)/tp3-forms/formik`       | —            |
| Formulaire (RHF) (TP3)    | `app/(main)/tp3-forms/rhf/index.tsx`     | Page (cachée Tab)    | `/tp3-forms/rhf`          | `/(main)/tp3-forms/rhf`          | —            |
| Robots (liste) (TP4)      | `app/(main)/tp4-robots/index.tsx`        | Tab                  | `/tp4-robots`             | `/(main)/tp4-robots`             | —            |
| Robots (create) (TP4)     | `app/(main)/tp4-robots/create.tsx`       | Page (dans l’onglet) | `/tp4-robots/create`      | `/(main)/tp4-robots/create`      | —            |
| Robots (edit) (TP4)       | `app/(main)/tp4-robots/edit/[id].tsx`    | Page (dans l’onglet) | `/tp4-robots/edit/:id`    | `/(main)/tp4-robots/edit/:id`    | `id: string` |
| Robots DB (liste) (TP5)   | `app/(main)/tp5-robots-db/index.tsx`     | Tab                  | `/tp5-robots-db`          | `/(main)/tp5-robots-db`          | —            |
| Robots DB (create) (TP5)  | `app/(main)/tp5-robots-db/create.tsx`    | Page (cachée Tab)    | `/tp5-robots-db/create`   | `/(main)/tp5-robots-db/create`   | —            |
| Robots DB (edit) (TP5)    | `app/(main)/tp5-robots-db/edit/[id].tsx` | Page (cachée Tab)    | `/tp5-robots-db/edit/:id` | `/(main)/tp5-robots-db/edit/:id` | `id: string` |
| Galerie (TP6)             | `app/(main)/tp6-camera/index.tsx`        | Tab                  | `/tp6-camera`             | `/(main)/tp6-camera`             | —            |
| Caméra (TP6)              | `app/(main)/tp6-camera/camera.tsx`       | Page (cachée Tab)    | `/tp6-camera/camera`      | `/(main)/tp6-camera/camera`      | —            |
| Photo détail (TP6)        | `app/(main)/tp6-camera/detail/[id].tsx`  | Page (cachée Tab)    | `/tp6-camera/detail/:id`  | `/(main)/tp6-camera/detail/:id`  | `id: string` |

Notes:

- La colonne « URL externe » ignore les groupes entre parenthèses (comportement Expo Router).
- Les écrans « cachés Tab » n’affichent pas d’onglet dédié mais restent dans la hiérarchie du groupe `(main)`.

---

## Comment tester rapidement

- Home → boutons « Page de l’ID … » pour ouvrir le Détail et tester le comportement de retour.
- TP3 Formulaires:
  - Formik: `/(main)/tp3-forms/formik` (lien Home + switch ⇄ depuis RHF).
  - RHF: `/(main)/tp3-forms/rhf` (lien Home + switch ⇄ depuis Formik).
- TP4 Robots (Zustand): onglet « Robots » → créer/éditer/supprimer un robot (persistance AsyncStorage).
- TP5 Robots DB (SQLite): onglet « Robots DB » → recherche/tri; créer/éditer; export JSON + import via sélecteur de fichiers; partage.
- TP6 Caméra: onglet « Galerie » → FAB pour capturer; ouvrir un détail pour partager/supprimer.
- Persistance de la dernière route: tuez l’app puis relancez; vous revenez sur l’écran précédent (grâce à `__last_pathname__`).
- Deep link (Android, exemple): `rnadvancedlabs://tp3-forms/formik`.

---

## Formik vs RHF (retour d’expérience – résumé)

- DX:
  - Formik: API simple mais plus verbeuse (inputs contrôlés, `touched`).
  - RHF: très efficace avec `Controller` et Zod; types et messages cohérents.
- Perfs: RHF limite les re-rendus via subscriptions; avantage sur formulaires moyens/grands.
- Typage: `Yup.InferType` vs `z.infer` + `zodResolver` (meilleure intégration avec RHF).

---

## Démarrage (rappel)

Dans le projet:

```bash
npm install
npm run start
```

Choisir la plateforme (Android/iOS/Web) depuis Expo.
