-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 23 mars 2026 à 16:32
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `legaltechtest`
--

-- --------------------------------------------------------

--
-- Structure de la table `categoriesignalement`
--

CREATE TABLE `categoriesignalement` (
  `IdCatSi` int(11) NOT NULL,
  `Libelle` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categoriesignalement`
--

INSERT INTO `categoriesignalement` (`IdCatSi`, `Libelle`) VALUES
(1, 'Harcèlement'),
(2, 'Discrimination'),
(3, 'Conflits d\'intérêts'),
(4, 'Corruption');

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

CREATE TABLE `commentaires` (
  `IdCommentaire` int(11) NOT NULL,
  `Contenu` text NOT NULL,
  `DateCommentaire` datetime DEFAULT current_timestamp(),
  `IdSignalement` int(11) NOT NULL,
  `IdUtil` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `commentaires`
--
DELIMITER $$
CREATE TRIGGER `trg_com_delete` BEFORE DELETE ON `commentaires` FOR EACH ROW BEGIN
    INSERT INTO historiqueactions (IdTypeAction, IdUtil, IdSignalement, AncienneValeur, NouvelleValeur)
    VALUES (3, @current_user_id, OLD.IdSignalement, 
    JSON_OBJECT('contenu', OLD.Contenu, 'auteur', OLD.IdUtil), NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_com_insert` AFTER INSERT ON `commentaires` FOR EACH ROW BEGIN
    INSERT INTO historiqueactions (IdTypeAction, IdUtil, IdSignalement, AncienneValeur, NouvelleValeur)
    VALUES (1, @current_user_id, NEW.IdSignalement, NULL, 
    JSON_OBJECT('action', 'nouveau_commentaire'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `documentssignalement`
--

CREATE TABLE `documentssignalement` (
  `IdDocument` int(11) NOT NULL,
  `NomFichier` varchar(255) NOT NULL,
  `LienMinIO` varchar(512) NOT NULL,
  `DateUpload` datetime DEFAULT current_timestamp(),
  `IdSignalement` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `historiqueactions`
--

CREATE TABLE `historiqueactions` (
  `IdHistoriqueAction` int(11) NOT NULL,
  `DateAction` datetime DEFAULT current_timestamp(),
  `IdTypeAction` int(11) DEFAULT NULL,
  `IdUtil` int(11) DEFAULT NULL,
  `IdSignalement` int(11) DEFAULT NULL,
  `AncienneValeur` text DEFAULT NULL,
  `NouvelleValeur` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `historiqueactions`
--

INSERT INTO `historiqueactions` (`IdHistoriqueAction`, `DateAction`, `IdTypeAction`, `IdUtil`, `IdSignalement`, `AncienneValeur`, `NouvelleValeur`) VALUES
(1, '2026-03-17 08:55:40', 1, 1, NULL, NULL, '{\"action\": \"nouveau_commentaire\"}'),
(2, '2026-03-17 08:56:17', 1, 1, NULL, NULL, '{\"action\": \"nouveau_commentaire\"}'),
(3, '2026-03-17 08:56:17', 2, 1, NULL, '{\"statut\": 2, \"resp\": 1}', '{\"statut\": 3, \"resp\": 1}'),
(4, '2026-03-23 16:31:36', 3, NULL, NULL, '{\"titre\": \"Signalement Test\"}', NULL),
(5, '2026-03-23 16:31:36', 3, NULL, NULL, '{\"titre\": \"sdfgsdfgf\"}', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `signalement`
--

CREATE TABLE `signalement` (
  `IdSignalement` int(11) NOT NULL,
  `Titre` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `IdUtil` int(11) NOT NULL,
  `IdResponsable` int(11) DEFAULT NULL,
  `IdStatutSi` int(11) DEFAULT NULL,
  `IdCatSi` int(11) DEFAULT NULL,
  `isAnonyme` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `signalement`
--
DELIMITER $$
CREATE TRIGGER `trg_sig_delete` BEFORE DELETE ON `signalement` FOR EACH ROW BEGIN
    INSERT INTO historiqueactions (IdTypeAction, IdUtil, IdSignalement, AncienneValeur, NouvelleValeur)
    VALUES (3, @current_user_id, OLD.IdSignalement, 
    JSON_OBJECT('titre', OLD.Titre), NULL);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_sig_insert` AFTER INSERT ON `signalement` FOR EACH ROW BEGIN
    INSERT INTO historiqueactions (IdTypeAction, IdUtil, IdSignalement, AncienneValeur, NouvelleValeur)
    VALUES (1, @current_user_id, NEW.IdSignalement, NULL, 
    JSON_OBJECT('titre', NEW.Titre, 'statut', NEW.IdStatutSi));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_sig_update` AFTER UPDATE ON `signalement` FOR EACH ROW BEGIN
    IF (OLD.IdStatutSi <> NEW.IdStatutSi OR OLD.IdResponsable <> NEW.IdResponsable) THEN
        INSERT INTO historiqueactions (IdTypeAction, IdUtil, IdSignalement, AncienneValeur, NouvelleValeur)
        VALUES (2, @current_user_id, NEW.IdSignalement, 
        JSON_OBJECT('statut', OLD.IdStatutSi, 'resp', OLD.IdResponsable),
        JSON_OBJECT('statut', NEW.IdStatutSi, 'resp', NEW.IdResponsable));
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `statutsignalement`
--

CREATE TABLE `statutsignalement` (
  `IdStatutSi` int(11) NOT NULL,
  `LibelleStatutSi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statutsignalement`
--

INSERT INTO `statutsignalement` (`IdStatutSi`, `LibelleStatutSi`) VALUES
(1, 'Envoyé'),
(2, 'Pris en charge'),
(3, 'Traitement en cours'),
(4, 'Résolu');

-- --------------------------------------------------------

--
-- Structure de la table `statututilisateur`
--

CREATE TABLE `statututilisateur` (
  `IdStatutUtil` int(11) NOT NULL,
  `LibelleStatutUtil` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statututilisateur`
--

INSERT INTO `statututilisateur` (`IdStatutUtil`, `LibelleStatutUtil`) VALUES
(1, 'Utilisateur'),
(2, 'RH'),
(3, 'Juriste');

-- --------------------------------------------------------

--
-- Structure de la table `typeaction`
--

CREATE TABLE `typeaction` (
  `IdTypeAction` int(11) NOT NULL,
  `LibelleTypeAction` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `typeaction`
--

INSERT INTO `typeaction` (`IdTypeAction`, `LibelleTypeAction`) VALUES
(1, 'Création'),
(2, 'Modification'),
(3, 'Suppression');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `IdUtil` int(11) NOT NULL,
  `Nom` varchar(100) DEFAULT NULL,
  `Prenom` varchar(100) DEFAULT NULL,
  `Pseudo` varchar(50) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `Hash_password` varchar(255) NOT NULL,
  `IdStatutUtil` int(11) DEFAULT NULL,
  `isFirstLog` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`IdUtil`, `Nom`, `Prenom`, `Pseudo`, `Email`, `Hash_password`, `IdStatutUtil`, `isFirstLog`) VALUES
(1, 'Satheesh', 'Sarushanth', 'strifaru', 'ssatheesh@gmail.com', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 2, 0),
(3, 'SARBACH', 'Théo', 'LeGrosFisteurdu10', 'tsarbach@gmail.com', '116cc476ac23bd03eda130210b6cb41eb76f0813d854ac6e7d670d4137f88291', 1, 0),
(4, 'Melis', 'Thomas', 'ntm', 'tmelis@gmail.com', '116cc476ac23bd03eda130210b6cb41eb76f0813d854ac6e7d670d4137f88291', 3, 0);

--
-- Déclencheurs `utilisateurs`
--
DELIMITER $$
CREATE TRIGGER `trg_util_update` AFTER UPDATE ON `utilisateurs` FOR EACH ROW BEGIN
    IF (OLD.IdStatutUtil <> NEW.IdStatutUtil) THEN
        INSERT INTO historiqueactions (IdTypeAction, IdUtil, IdSignalement, AncienneValeur, NouvelleValeur)
        VALUES (2, @current_user_id, NULL, 
        JSON_OBJECT('role_old', OLD.IdStatutUtil),
        JSON_OBJECT('role_new', NEW.IdStatutUtil));
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_signalement`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `vue_signalement` (
`IdSignalement` int(11)
,`Titre` varchar(255)
,`Description` text
,`Date` date
,`IdUtil` int(11)
,`IdResponsable` int(11)
,`IdStatutSi` int(11)
,`IdCatSi` int(11)
,`isAnonyme` tinyint(1)
,`Libelle` varchar(100)
,`LibelleStatutSi` varchar(100)
,`info_utilisateur` varchar(201)
);

-- --------------------------------------------------------

--
-- Structure de la vue `vue_signalement`
--
DROP TABLE IF EXISTS `vue_signalement`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_signalement`  AS SELECT `s`.`IdSignalement` AS `IdSignalement`, `s`.`Titre` AS `Titre`, `s`.`Description` AS `Description`, `s`.`Date` AS `Date`, `s`.`IdUtil` AS `IdUtil`, `s`.`IdResponsable` AS `IdResponsable`, `s`.`IdStatutSi` AS `IdStatutSi`, `s`.`IdCatSi` AS `IdCatSi`, `s`.`isAnonyme` AS `isAnonyme`, `cs`.`Libelle` AS `Libelle`, `ss`.`LibelleStatutSi` AS `LibelleStatutSi`, CASE WHEN `s`.`isAnonyme` = 1 THEN `u`.`Pseudo` ELSE concat(`u`.`Nom`,' ',`u`.`Prenom`) END AS `info_utilisateur` FROM (((`signalement` `s` join `categoriesignalement` `cs` on(`s`.`IdCatSi` = `cs`.`IdCatSi`)) join `statutsignalement` `ss` on(`s`.`IdStatutSi` = `ss`.`IdStatutSi`)) join `utilisateurs` `u` on(`s`.`IdUtil` = `u`.`IdUtil`)) ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categoriesignalement`
--
ALTER TABLE `categoriesignalement`
  ADD PRIMARY KEY (`IdCatSi`);

--
-- Index pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`IdCommentaire`),
  ADD KEY `IdSignalement` (`IdSignalement`),
  ADD KEY `IdUtil` (`IdUtil`);

--
-- Index pour la table `documentssignalement`
--
ALTER TABLE `documentssignalement`
  ADD PRIMARY KEY (`IdDocument`),
  ADD KEY `IdSignalement` (`IdSignalement`);

--
-- Index pour la table `historiqueactions`
--
ALTER TABLE `historiqueactions`
  ADD PRIMARY KEY (`IdHistoriqueAction`),
  ADD KEY `IdTypeAction` (`IdTypeAction`),
  ADD KEY `IdUtil` (`IdUtil`),
  ADD KEY `IdSignalement` (`IdSignalement`);

--
-- Index pour la table `signalement`
--
ALTER TABLE `signalement`
  ADD PRIMARY KEY (`IdSignalement`),
  ADD KEY `IdUtil` (`IdUtil`),
  ADD KEY `IdStatutSi` (`IdStatutSi`),
  ADD KEY `IdCatSi` (`IdCatSi`);

--
-- Index pour la table `statutsignalement`
--
ALTER TABLE `statutsignalement`
  ADD PRIMARY KEY (`IdStatutSi`);

--
-- Index pour la table `statututilisateur`
--
ALTER TABLE `statututilisateur`
  ADD PRIMARY KEY (`IdStatutUtil`);

--
-- Index pour la table `typeaction`
--
ALTER TABLE `typeaction`
  ADD PRIMARY KEY (`IdTypeAction`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`IdUtil`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `IdStatutUtil` (`IdStatutUtil`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categoriesignalement`
--
ALTER TABLE `categoriesignalement`
  MODIFY `IdCatSi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `IdCommentaire` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `documentssignalement`
--
ALTER TABLE `documentssignalement`
  MODIFY `IdDocument` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `historiqueactions`
--
ALTER TABLE `historiqueactions`
  MODIFY `IdHistoriqueAction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `signalement`
--
ALTER TABLE `signalement`
  MODIFY `IdSignalement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `statutsignalement`
--
ALTER TABLE `statutsignalement`
  MODIFY `IdStatutSi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `statututilisateur`
--
ALTER TABLE `statututilisateur`
  MODIFY `IdStatutUtil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `typeaction`
--
ALTER TABLE `typeaction`
  MODIFY `IdTypeAction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `IdUtil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`IdSignalement`) REFERENCES `signalement` (`IdSignalement`) ON DELETE CASCADE,
  ADD CONSTRAINT `commentaires_ibfk_2` FOREIGN KEY (`IdUtil`) REFERENCES `utilisateurs` (`IdUtil`);

--
-- Contraintes pour la table `documentssignalement`
--
ALTER TABLE `documentssignalement`
  ADD CONSTRAINT `documentssignalement_ibfk_1` FOREIGN KEY (`IdSignalement`) REFERENCES `signalement` (`IdSignalement`) ON DELETE CASCADE;

--
-- Contraintes pour la table `historiqueactions`
--
ALTER TABLE `historiqueactions`
  ADD CONSTRAINT `historiqueactions_ibfk_1` FOREIGN KEY (`IdTypeAction`) REFERENCES `typeaction` (`IdTypeAction`),
  ADD CONSTRAINT `historiqueactions_ibfk_2` FOREIGN KEY (`IdUtil`) REFERENCES `utilisateurs` (`IdUtil`),
  ADD CONSTRAINT `historiqueactions_ibfk_3` FOREIGN KEY (`IdSignalement`) REFERENCES `signalement` (`IdSignalement`) ON DELETE SET NULL;

--
-- Contraintes pour la table `signalement`
--
ALTER TABLE `signalement`
  ADD CONSTRAINT `signalement_ibfk_1` FOREIGN KEY (`IdUtil`) REFERENCES `utilisateurs` (`IdUtil`),
  ADD CONSTRAINT `signalement_ibfk_2` FOREIGN KEY (`IdStatutSi`) REFERENCES `statutsignalement` (`IdStatutSi`),
  ADD CONSTRAINT `signalement_ibfk_3` FOREIGN KEY (`IdCatSi`) REFERENCES `categoriesignalement` (`IdCatSi`);

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `utilisateurs_ibfk_1` FOREIGN KEY (`IdStatutUtil`) REFERENCES `statututilisateur` (`IdStatutUtil`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
