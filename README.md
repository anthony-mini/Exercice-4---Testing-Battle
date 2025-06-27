# API de Conversion et Calculs Financiers

API REST pour les conversions de devises et calculs financiers, développée avec Node.js et Express.

## 📋 Prérequis

- Node.js: `^22.0.0` (LTS)
- npm: `^10.0.0` (livré avec Node.js 22)

## 🚀 Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd [NOM_DU_PROJET]
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer un fichier `.env` à la racine du projet :
   ```env
   NODE_ENV=development
   PORT=3000
   ```

## 🏃‍♂️ Démarrage

- **Développement** :
  ```bash
  npm run dev
  ```
  Le serveur redémarre automatiquement à chaque modification.

- **Production** :
  ```bash
  npm start
  ```

## 🧪 Tests

- Lancer les tests :
  ```bash
  npm test
  ```

- Lancer les tests avec couverture :
  ```bash
  npm run test:ci
  ```

## 🛠️ Technologies utilisées

- **Node.js** : ^22.0.0 (LTS)
- **Express** : ^5.1.0
- **Express Validator** : ^7.2.1
- **CORS** : ^2.8.5
- **Jest** : ^30.0.2 (pour les tests)

## 🔒 Variables d'environnement

| Variable    | Description                     | Valeur par défaut |
|-------------|---------------------------------|-------------------|
| NODE_ENV    | Environnement d'exécution      | development       |
| PORT        | Port d'écoute du serveur       | 3000              |

## 🚀 Déploiement

Pour le déploiement en production, assurez-vous de définir `NODE_ENV=production`.
