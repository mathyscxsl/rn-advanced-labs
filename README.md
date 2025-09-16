# TP1 - Profile Screen

## Lien vers le TP1

Le code du TP1 se trouve dans le dossier :  
[TP1 - Profile Screen](../rn-advanced-labs/app/tp1-profile-card/)

## Description de l'écran

Cet écran correspond au premier écran de l'application : la **Profile Screen**.  
Il contient une **Profile Card** qui affiche les informations de l'utilisateur (avatar, nom, rôle, etc.) et sert de base pour les prochains écrans de l'application.

## Persistance et UX mobile

L'application persiste la dernière page visitée : à la réouverture, l'utilisateur est automatiquement ramené sur l'écran où il s'était arrêté (via AsyncStorage). L'UX reproduit les usages des applications mobiles classiques, avec un bouton de retour en haut à gauche sur les écrans de détail et un menu de navigation en bas pour accéder rapidement aux sections principales.

## Arborescence du projet (`app/`)

```sh
rn-advanced-labs
└── app
    ├── (auth)
    ├── (main)
    │   ├── (detail)
    │   │   ├── _layout.tsx
    │   │   └── [id].tsx
    │   ├── tp1-profile-card
    │   │   ├── components
    │   │   ├── screens
    │   │   └── index.tsx
    │   ├── _layout.tsx
    │   └── index.tsx
    └── _layout.tsx

8 directories, 6 files
```
