-- Création de la base de données
CREATE DATABASE IF NOT EXISTS legaltechtest;
USE legaltechtest;

-- ==========================================================
-- 1. TABLES DE RÉFÉRENCE (Lookup Tables)
-- ==========================================================

CREATE TABLE StatutUtilisateur (
    IdStatutUtil INT AUTO_INCREMENT PRIMARY KEY,
    LibelleStatutUtil VARCHAR(100) NOT NULL
);

INSERT INTO StatutUtilisateur (IdStatutUtil, LibelleStatutUtil) VALUES
(1, 'Utilisateur'), -- Correspond aux données du fichier
(2, 'RH');          -- Correspond aux données du fichier

CREATE TABLE StatutSignalement (
    IdStatutSi INT AUTO_INCREMENT PRIMARY KEY,
    LibelleStatutSi VARCHAR(100) NOT NULL
);

INSERT INTO StatutSignalement (IdStatutSi, LibelleStatutSi) VALUES
(1, 'Pris en charge'),
(2, 'Envoyé');

CREATE TABLE CategorieSignalement (
    IdCatSi INT AUTO_INCREMENT PRIMARY KEY,
    Libelle VARCHAR(100) NOT NULL
);

INSERT INTO CategorieSignalement (IdCatSi, Libelle) VALUES
(1, 'Harcèlement'),
(2, 'Discrimination'),
(3, 'Conflits d\'intérêts'),
(4, 'Corruption');

CREATE TABLE TypeAction (
    IdTypeAction INT AUTO_INCREMENT PRIMARY KEY,
    LibelleTypeAction VARCHAR(100) NOT NULL
);

INSERT INTO TypeAction (LibelleTypeAction) VALUES ('Création'), ('Modification'), ('Suppression');

-- ==========================================================
-- 2. TABLES PRINCIPALES
-- ==========================================================

CREATE TABLE Utilisateurs (
    IdUtil INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(100),
    Prenom VARCHAR(100),
    Email VARCHAR(150) UNIQUE NOT NULL,
    Hash_password VARCHAR(255) NOT NULL,
    IdStatutUtil INT,
    FOREIGN KEY (IdStatutUtil) REFERENCES StatutUtilisateur(IdStatutUtil)
);

-- Insertion des utilisateurs
INSERT INTO Utilisateurs (IdUtil, Nom, Prenom, Email, Hash_password, IdStatutUtil) VALUES
(1, 'SARBACH', 'Théo', 'theosarbach0407@gmail.com', '12345678', 1),
(2, 'Satheesh', 'Sarushanth', 'saru@gmail.com', 'azerty', 1),
(3, 'MELIS', 'Thomas', 'thomasmelis@gmail.com', 'Bomboclat', 2);

CREATE TABLE Signalement (
    IdSignalement INT AUTO_INCREMENT PRIMARY KEY,
    Titre VARCHAR(255) NOT NULL,
    Description TEXT,
    Date DATE,
    IdUtil INT NOT NULL,      -- Auteur du signalement
    IdResponsable INT NULL,   -- RH en charge (0 dans ton fichier est devenu NULL ici)
    IdStatutSi INT,
    IdCatSi INT,
    FOREIGN KEY (IdUtil) REFERENCES Utilisateurs(IdUtil),
    FOREIGN KEY (IdStatutSi) REFERENCES StatutSignalement(IdStatutSi),
    FOREIGN KEY (IdCatSi) REFERENCES CategorieSignalement(IdCatSi)
);

-- Insertion des signalements avec mapping des IDs
INSERT INTO Signalement (IdSignalement, Titre, Description, Date, IdUtil, IdResponsable, IdStatutSi, IdCatSi) VALUES
(1, 'Test', 'Je me fais taper', '2026-01-10', 1, NULL, 1, 1),
(2, 'Aieu', 'Lorem Ipsum...', '2026-01-10', 1, NULL, 1, 2),
(3, 'Conflits', 'Je suis en conlit', '2026-01-10', 1, 3, 1, 3),
(4, 'Harcelement', 'Aiiiie', '2026-01-10', 2, NULL, 1, 1),
(5, 'Testeu', 'description du chef', '2026-01-10', 2, NULL, 2, 2),
(6, 'Testtt', 'sdsdsdsdsd', '2026-01-10', 1, NULL, 2, 1),
(7, 'Nouveau', 'Je viens de créer un signalements', '2026-01-11', 2, NULL, 2, 4);

-- ==========================================================
-- 3. TABLES DE SUIVI ET DOCUMENTS (Vides pour l'instant)
-- ==========================================================

CREATE TABLE HistoriqueActions (
    IdHistoriqueAction INT AUTO_INCREMENT PRIMARY KEY,
    DateAction DATETIME DEFAULT CURRENT_TIMESTAMP,
    IdTypeAction INT,
    IdUtil INT,
    IdSignalement INT,
    AncienneValeur TEXT,
    NouvelleValeur TEXT,
    FOREIGN KEY (IdTypeAction) REFERENCES TypeAction(IdTypeAction),
    FOREIGN KEY (IdUtil) REFERENCES Utilisateurs(IdUtil),
    FOREIGN KEY (IdSignalement) REFERENCES Signalement(IdSignalement)
);