# LegalTech - Plateforme de Signalement Sécurisée

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/strifaru/legaltechproject)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-supported-blue.svg)](https://www.docker.com/)

## 📝 Présentation du projet

LegalTech est une solution web robuste conçue pour permettre aux collaborateurs d'une organisation de signaler des comportements inappropriés (harcèlement, discrimination, corruption, etc.) de manière sécurisée et, si souhaité, anonyme.

Le projet met l'accent sur la **protection des données** et le **respect de la confidentialité**, en utilisant des protocoles de chiffrement pour les informations sensibles et un stockage objet isolé pour les preuves documentaires.

---

## 🚀 Fonctionnalités clés

- **Signalement Anonyme** : Possibilité de déposer un dossier sans révéler son identité.
- **Sécurité Avancée** :
  - Chiffrement AES-128 des descriptions et noms de fichiers.
  - Hachage SHA-256 avec Sel (Salt) pour les mots de passe.
- **Gestion Documentaire** : Intégration de **MinIO** pour un stockage objet sécurisé.
- **Suivi des dossiers** : Interface dédiée pour les RH et Juristes (assignation, changement de statut).
- **Audit Log** : Historisation automatique de toutes les actions via des triggers SQL.
- **Onboarding sécurisé** : Flux de première connexion pour la configuration des comptes staff.

---

## 🏗️ Architecture Technique

Le projet repose sur une architecture moderne conteneurisée :

- **Frontend** : React.js (Vite) - Interface premium et dynamique.
- **Backend** : Node.js (Express) - API REST sécurisée.
- **Base de données** : MySQL - Persistance des données et logique métier (Triggers).
- **Stockage** : MinIO - Serveur de stockage objet auto-hébergé.
- **Infrastructure** : Docker & Docker-compose.

---

## 🛠️ Installation et Démarrage

### Pré-requis
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (optionnel si utilisation exclusive de Docker)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone [url-du-depot]
   cd legaltechproject
   ```

2. **Lancer l'infrastructure (Docker)**
   ```bash
   docker-compose up -d
   ```

3. **Initialiser la base de données**
   Importez le fichier `legaltechtest.sql` dans votre instance MySQL.

4. **Démarrer les services localement (Mode développement)**

   **Backend :**
   ```bash
   cd Backend
   npm install
   npm start
   ```

   **Frontend :**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

L'application est alors accessible sur `http://localhost:5173`.

---

## 📄 Documentation

Pour plus de détails, consultez les documents suivants :
- [Documentation Technique](docs/technique.md)
- [Documentation Utilisateur](docs/utilisateur.md)

---

## 👤 Auteurs
- **SATHEESH Sarushanth** - *Développement & Architecture*
- **Projet BTS SIO 2026**
