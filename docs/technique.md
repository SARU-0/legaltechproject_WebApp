# Documentation Technique - LegalTech 

Ce document détaille les choix techniques, l'architecture des données et les mesures de sécurité implémentées dans le projet.

## 1. Architecture Globale

L'application suit un modèle **Client-Serveur** découplé :
- **Client (React)** : Consomme l'API REST, gère l'état de l'UI et le hachage initial des mots de passe.
- **Serveur (Express)** : Gère l'authentification, le chiffrement des données, la logique métier et l'interface avec MinIO.
- **Services tiers** : 
  - **MySQL** : Stockage relationnel.
  - **MinIO** : Stockage des preuves documentaires.

## 2. Sécurité des données (RGPD)

La sécurité est au cœur de la plateforme pour garantir la confidentialité des lanceurs d'alerte.

### 2.1 Chiffrement au repos (AES)
Toutes les données sensibles en base de données sont chiffrées via l'algorithme **AES-128-ECB**.
- **Champs concernés** : `Description` (table `signalement`), `NomFichier` (table `documentssignalement`).
- **Logique** : Le serveur utilise le module `crypto` de Node.js pour chiffrer à l'insertion et déchiffrer à la lecture.

### 2.2 Authentification sécurisée (SHA-256 + Salt)
Le système évite le stockage de mots de passe en clair ou hachés simplement.
1. Le frontend envoie un premier hash du mot de passe.
2. Le backend génère/récupère un **sel unique (Salt)** pour l'utilisateur.
3. Un hash final est calculé : `SHA256(Hash_frontend + Salt)`.

## 3. Modèle de données et Logique SQL

### 3.1 Vues SQL
Une vue `vue_signalement` est utilisée pour simplifier les requêtes complexes du frontend, incluant les jointures entre signalements, catégories, statuts et auteurs.

### 3.2 Triggers (Journalisation)
Des triggers ont été mis en place pour assurer un audit complet (table `historiqueactions`) :
- `trg_sig_insert` / `trg_sig_update` : Trace les créations et changements de statuts des dossiers.
- `trg_com_insert` / `trg_com_delete` : Trace l'activité des commentaires.
- `trg_util_update` : Trace les changements de rôles des utilisateurs.

## 4. Gestion Documentaire (MinIO)

Le projet utilise **MinIO** pour stocker les pièces jointes volumineuses ou sensibles.
- **Upload** : Le serveur stocke le fichier dans un dossier nommé `signalement_[ID]`.
- **Accès sécurisé** : Les fichiers ne sont jamais exposés directement via une URL publique. Le serveur génère une **URL présignée** (durée de validité de 1h) lors de chaque demande de consultation, garantissant que seul un utilisateur authentifié peut voir le document.

## 5. Déploiement (Docker)

Le fichier `docker-compose.yml` orchestre les services :
- `db` : Instance MySQL.
- `minio` : Instance de stockage objet.
- `adminer` : Outil de gestion de base de données (optionnel).

## 👤 Auteurs
- **SATHEESH Sarushanth** - *Développement & Architecture*
- **Projet BTS SIO 2026**
