# RN Advanced Labs

## Description de l'écran

Cet écran correspond au premier écran de l'application : la **Profile Screen**.  
Il contient une **Profile Card** qui affiche les informations de l'utilisateur (avatar, nom, rôle, etc.) et sert de base pour les prochains écrans de l'application.

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
    │   └── (detail)/              # Groupe Stack (masqué dans la TabBar)
    │       ├── _layout.tsx        # Stack avec header custom + back remplacé
    │       └── [id].tsx           # Écran Détail dynamique
    └── (auth)/                    # (placeholder)
```

Rappels Expo Router:

- Les groupes entre parenthèses (ex: `(main)`, `(detail)`) n’apparaissent pas dans l’URL externe; ils servent à organiser et à contrôler le type de navigateur (Tabs/Stack).

---

## Table des routes

| Nom (écran)  | Fichier                                 | Type  | URL externe (deep link) | Href interne (app)         | Paramètres   |
| ------------ | --------------------------------------- | ----- | ----------------------- | -------------------------- | ------------ |
| Home         | `app/(main)/index.tsx`                  | Tab   | `/`                     | `/(main)` ou `/`           | —            |
| Profile Card | `app/(main)/tp1-profile-card/index.tsx` | Tab   | `/tp1-profile-card`     | `/(main)/tp1-profile-card` | —            |
| Détail       | `app/(main)/(detail)/[id].tsx`          | Stack | `/:id`                  | `/(detail)/:id`            | `id: string` |

- Les colonnes « URL externe » ignorent les groupes entre parenthèses (comportement standard Expo Router).
- Les `href` internes peuvent référencer les groupes pour cibler le bon navigateur (Tabs vs Stack).

Exemples:

- Interne: `Link href="/(detail)/42"` ouvre l’écran Détail avec `id=42`.
- Externe (deep link Web): `https://<votre-domaine>/:id` → `https://…/42`.
- Externe (schéma natif): `rnadvancedlabs://:id` → `rnadvancedlabs://42`.

---

## Scénarios de persistance et deep linking

- Démarrage à froid (froid):
  - Au lancement, `app/_layout.tsx` lit `__last_pathname__` depuis `AsyncStorage` et fait `router.replace(saved)` si disponible.
  - Si l’URL restaurée est invalide/non résoluble, l’app reste sur l’accueil.
- Reprise à tiède (tiède):
  - L’app reprend exactement sur l’écran courant. Le `pathname` est mis à jour en continu dans `AsyncStorage`.
- Navigation à chaud (dans l’app):
  - Sur l’écran Détail, le bouton « Retour » remplace la navigation par `router.replace("/(main)/")` (évite les piles profondes et garde une UX mobile cohérente).
- Deep linking:
  - Schéma natif: `rnadvancedlabs://` (défini dans `app.json`).
  - Liens pris en charge automatiquement par Expo Router via `expo-linking`.
  - Recommandation: pour des liens externes, ne pas inclure les groupes (utiliser `/:id`, `/tp1-profile-card`, etc.).

---

## Comment tester rapidement

- Ouvrir un détail depuis l’accueil: boutons « Page de l'ID … » dans `Home`.
- Tuer l’app puis relancer: la dernière route est restaurée (par ex. l’écran Détail d’un ID).
- Tester le deep link (Android): `adb shell am start -W -a android.intent.action.VIEW -d "rnadvancedlabs://42" com.example.rnadvancedlabs`.
