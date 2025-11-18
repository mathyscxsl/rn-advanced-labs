---
Title: TP1 – Profile Card (UI + état local)
Date: 2025-11-18T00:00:00Z
Owner: Mathys
Scope: Écran `app/(main)/tp1-profile-card/index.tsx`
OutOfScope: Navigation globale, données distantes
---

## Objectif

Concevoir une carte profil simple avec avatar, nom, compteur de followers en auto-incrément et bouton Follow/Unfollow, en respectant les patterns React Native.

## Contexte

- Projet Expo Router (Tabs + Stack).
- Composant cible: `tp1-profile-card/index.tsx` avec état local (useState, useEffect).

## Contraintes

- UI sobre, accessible (touch targets, contrastes).
- Aucune dépendance externe supplémentaire.
- Code typé et linté.

## Étapes proposées à l'IA (agent)

1. Définir le contrat du composant (props minimales si besoin).
2. Implémenter UI (Image, Text, TouchableOpacity) et styles.
3. Gérer l'état `followers` qui s'incrémente (interval) + nettoyage.
4. Gérer `isFollowing` et les effets sur le compteur.
5. Auto-revue: lisibilité, accessibilité (labels), petites tailles d’éléments.

## Critères d'acceptation

- Bouton Follow/Unfollow fonctionnel et compteur cohérent.
- Pas d’avertissements au build, pas d’erreurs ESLint/TS.

## Plan de test minimal

- Rendu: avatar + nom + bouton visibles.
- Interaction: le bouton alterne et le compteur évolue comme attendu.

## Risques & mitigations

- Fuite d’interval: s’assurer de clearInterval dans `useEffect` cleanup.
- Clics rapides: ne pas décrémenter en deçà de 0 (si logique adaptée).
