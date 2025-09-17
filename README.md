# RN Advanced Labs

## Description de l'écran

Cet écran correspond au premier écran de l'application : la **Profile Screen**.  
Il contient une **Profile Card** qui affiche les informations de l'utilisateur (avatar, nom, rôle, etc.) et sert de base pour les prochains écrans de l'application.

Ajouts récents (TP3 - Forms):

- Formulaire (Formik) — `/(main)/tp3-forms/formik`
- Formulaire (RHF + Zod) — `/(main)/tp3-forms/rhf`
- Depuis chaque formulaire, un bouton dans le header permet de basculer rapidement vers l'autre (Formik ⇄ RHF) sans revenir à l'accueil.

Accès depuis l'accueil (Home):

- Lien « Formulaire (Formik) » présent sur la page d’accueil.
- Lien « Formulaire (RHF + Zod) » présent sur la page d’accueil.
- Les deux écrans proposent un bouton de switch dans le header (⇄) pour naviguer entre eux avec retour haptique.

## Persistance et UX mobile

L'application persiste la dernière page visitée : à la réouverture, l'utilisateur est automatiquement ramené sur l'écran où il s'était arrêté (via AsyncStorage). L'UX reproduit les usages des applications mobiles classiques, avec un bouton de retour en haut à gauche sur les écrans de détail et un menu de navigation en bas pour accéder rapidement aux sections principales.

- Persistance: `AsyncStorage` enregistre la clé `__last_pathname__` à chaque changement d'URL (voir `app/_layout.tsx`). Au démarrage, la route est restaurée via `router.replace(savedPath)`.
- Bouton retour (écran Détail): interception de l'événement `beforeRemove` pour forcer un retour à l'accueil via `router.replace("/(main)/")` (voir `app/(main)/(detail)/_layout.tsx`).

---

## Packages installés et rôle

- expo: runtime Expo + CLI pour démarrer, builder et configurer le projet.
- expo-router: routage fichier-par-fichier (Stack/Tabs) + deep linking automatique.
- @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/elements: fondations React Navigation utilisées par Expo Router (thème, onglets, composants d’UI).
- @react-native-async-storage/async-storage: persistance clé/valeur (restauration de la dernière route).
- expo-linking: gestion du deep linking (utilisé par Expo Router).
- expo-splash-screen, expo-status-bar, expo-system-ui, expo-constants, expo-font, expo-image, expo-web-browser, expo-haptics, expo-symbols: utilitaires Expo pour UI, médias, haptics et intégrations système.
- react, react-native: base de l’app.
- react-native-gesture-handler, react-native-reanimated, react-native-screens, react-native-safe-area-context: primitives de navigation/gestes/performances.
- @expo/vector-icons: icônes tab bar.
- react-native-web, react-dom: support Web.
- react-native-worklets: API worklets (Reanimated v3+ écosystème).
- Dev: typescript, @types/react, eslint, eslint-config-expo.

Formulaires:

- formik + yup: gestion contrôlée du state des champs + validation schéma.
- react-hook-form (RHF): approche orientée inputs non contrôlés avec subscriptions (meilleur perfs), `Controller` pour inputs RN.
- zod: schémas typés, inférence TypeScript.
- @hookform/resolvers: intégration Zod ↔ RHF (à installer si absent: `npm i @hookform/resolvers`).

Notes de config:

- `app.json`: `scheme: "rnadvancedlabs"` (deep link), `experiments.typedRoutes: true` (types générés pour les routes).
- `package.json`: entrée `main: "expo-router/entry"`.

---

## Arborescence du projet (`app/`)

```sh
rn-advanced-labs
└── app
    ├── _layout.tsx                # Root Stack + restauration de route
    ├── (main)/                    # Groupe principal (Tabs)
    │   ├── _layout.tsx            # Tabs: Home, Profile, groupe Détail masqué
    │   ├── index.tsx              # Home (onglet 1)
    │   ├── tp1-profile-card/
    │   │   └── index.tsx          # Profile Card (onglet 2)
    │   ├── (detail)/              # Groupe Stack (masqué dans la TabBar)
    │   │   ├── _layout.tsx        # Stack avec header custom + back remplacé
    │   │   └── [id].tsx           # Écran Détail dynamique
    │   └── tp3-forms/
    │       ├── formik/
    │       │   ├── _layout.tsx    # Stack custom + bouton switch ⇄ RHF
    │       │   └── index.tsx      # Formulaire avec Formik + Yup
    │       └── rhf/
    │           ├── _layout.tsx    # Stack custom + bouton switch ⇄ Formik
    │           └── index.tsx      # Formulaire avec RHF + Zod
    └── (auth)/                    # (placeholder)
```

Rappels Expo Router:

- Les groupes entre parenthèses (ex: `(main)`, `(detail)`) n’apparaissent pas dans l’URL externe; ils servent à organiser et à contrôler le type de navigateur (Tabs/Stack).

---

## Table des routes

| Nom (écran)         | Fichier                                 | Type               | URL externe (deep link) | Href interne (app)         | Paramètres   |
| ------------------- | --------------------------------------- | ------------------ | ----------------------- | -------------------------- | ------------ |
| Home                | `app/(main)/index.tsx`                  | Tab                | `/`                     | `/(main)` ou `/`           | —            |
| Profile Card        | `app/(main)/tp1-profile-card/index.tsx` | Tab                | `/tp1-profile-card`     | `/(main)/tp1-profile-card` | —            |
| Détail              | `app/(main)/(detail)/[id].tsx`          | Stack              | `/:id`                  | `/(detail)/:id`            | `id: string` |
| Formulaire (Formik) | `app/(main)/tp3-forms/formik/index.tsx` | Page (masquée Tab) | `/tp3-forms/formik`     | `/(main)/tp3-forms/formik` | —            |
| Formulaire (RHF)    | `app/(main)/tp3-forms/rhf/index.tsx`    | Page (masquée Tab) | `/tp3-forms/rhf`        | `/(main)/tp3-forms/rhf`    | —            |

- Les colonnes « URL externe » ignorent les groupes entre parenthèses (comportement standard Expo Router).
- Les `href` internes peuvent référencer les groupes pour cibler le bon navigateur (Tabs vs Stack).

Exemples:

- Interne: `Link href="/(detail)/42"` ouvre l’écran Détail avec `id=42`.
- Externe (deep link Web): `https://<votre-domaine>/tp3-forms/formik`.
- Externe (schéma natif): `rnadvancedlabs://tp3-forms/rhf`.

---

## Formik vs RHF (retour d’expérience)

DX (Developer eXperience):

- Formik: API simple à appréhender (handleChange/handleBlur, errors, touched). Un peu verbeux sur RN (TextInput contrôlés). Schémas Yup séparés du type des valeurs.
- RHF: API centrée sur la perf (non contrôlé). `Controller` s’intègre bien avec `TextInput`/`Switch`. DX excellente avec Zod (types inférés).

Perf perçue et re-rendus:

- Formik: les changements de champs provoquent des re-rendus du formulaire/fields selon la stratégie; sur des gros formulaires, on le ressent plus.
- RHF: moins de re-rendus grâce aux subscriptions; chaque champ observe seulement ce qui le concerne.

Instrumenter les re-rendus (exemples rapides):

- Ajouter `console.count("Formik render")` dans `FormikSignupScreen` et `console.count("RHF render")` dans `RHFSignupScreen`.
- Pour un champ, créer un petit composant `FieldContainer` et le wrapper avec `React.memo`, puis logguer `console.count("Field email render")` à l’intérieur pour comparer.

Aide du typage TypeScript:

- Formik + Yup: `Yup.InferType<typeof schema>` donne le type des valeurs, mais Formik ne lit pas directement ce type depuis Yup; il faut aussi typer `Formik<Values>`.
- RHF + Zod: `z.infer<typeof schema>` + `zodResolver(schema)` synchronisent structure, messages et types; meilleure autocomplétion et erreurs plus précises.

Verbosité:

- Formik: pattern contrôlé ⇒ plus de props (`value`, `onChangeText`, `onBlur`) + gestion `touched` pour l’affichage des erreurs.
- RHF: avec `Controller`, wiring concis; erreurs via `formState.errors` directement. Code souvent plus court, surtout sur de gros écrans.

Recommandations:

- Petits formulaires: Formik convient parfaitement et reste très lisible.
- Formulaires moyens à grands: RHF + Zod recommandé (perfs et typage).

---

## Comment tester rapidement

- Ouvrir un détail depuis l’accueil: boutons « Page de l'ID … » dans `Home`.
- Formulaires:
  - Formik: `/(main)/tp3-forms/formik` (lien présent sur Home + bouton switch depuis RHF).
  - RHF: `/(main)/tp3-forms/rhf` (lien présent sur Home + bouton switch depuis Formik).
- Tuer l’app puis relancer: la dernière route est restaurée (par ex. l’écran Détail ou une page Formulaire).
- Tester le deep link (Android): `adb shell am start -W -a android.intent.action.VIEW -d "rnadvancedlabs://tp3-forms/formik" com.example.rnadvancedlabs`.
