-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 23 fév. 2026 à 13:08
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

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
-- Structure de la table `signalement`
--

CREATE TABLE `signalement` (
  `idSignalement` int(11) NOT NULL,
  `Titre` text NOT NULL,
  `Description` text NOT NULL,
  `Categorie` varchar(30) NOT NULL,
  `Date` date NOT NULL,
  `StatutSi` varchar(30) NOT NULL,
  `idUtil` int(11) DEFAULT NULL,
  `idResponsable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `signalement`
--

INSERT INTO `signalement` (`idSignalement`, `Titre`, `Description`, `Categorie`, `Date`, `StatutSi`, `idUtil`, `idResponsable`) VALUES
(1, 'Test', 'Je me fais taper', 'Harcèlement', '2026-01-10', 'Pris en charge', 1, 0),
(2, 'Aieu', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Discrimination', '2026-01-10', 'Pris en charge', 1, 0),
(3, 'Conflits', 'Je suis en conlit', 'Conflits d\'intérêts', '2026-01-10', 'Pris en charge', 1, 3),
(4, 'Harcelement', 'Aiiiie', 'Harcèlement', '2026-01-10', 'Pris en charge', 2, 0),
(5, 'Testeu', 'description du chef', 'Discrimination', '2026-01-10', 'Envoyé', 2, 0),
(6, 'Testtt', 'sdsdsdsdsd', 'Harcèlement', '2026-01-10', 'Envoyé', 1, 0),
(7, 'Nouveau', 'Je viens de créer un signalements', 'Corruption', '2026-01-11', 'Envoyé', 2, 0);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `idUtil` int(11) NOT NULL,
  `Nom` varchar(255) DEFAULT NULL,
  `Prenom` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Hash_password` varchar(255) DEFAULT NULL,
  `Statut` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`idUtil`, `Nom`, `Prenom`, `Email`, `Hash_password`, `Statut`) VALUES
(1, 'SARBACH', 'Théo', 'theosarbach0407@gmail.com', '12345678', 'Utilisateur'),
(2, 'Satheesh', 'Sarushanth', 'saru@gmail.com', 'azerty', 'Utilisateur'),
(3, 'MELIS', 'Thomas', 'thomasmelis@gmail.com', 'Bomboclat', 'RH');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `signalement`
--
ALTER TABLE `signalement`
  ADD PRIMARY KEY (`idSignalement`),
  ADD KEY `fk_signalement_utilisateur` (`idUtil`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`idUtil`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `signalement`
--
ALTER TABLE `signalement`
  MODIFY `idSignalement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `idUtil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `signalement`
--
ALTER TABLE `signalement`
  ADD CONSTRAINT `fk_signalement_utilisateur` FOREIGN KEY (`idUtil`) REFERENCES `utilisateur` (`idUtil`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
