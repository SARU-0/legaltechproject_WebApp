import React from 'react';
import '../styles/LegalDocuments.css';

const LegalDocuments = ({ onBack }) => {
    return (
        <div className="legal-container">
            <header className="legal-header">
                <h1>Informations Légales</h1>
                {onBack && (
                    <button className="back-link" onClick={onBack}>
                        ← Retour à la connexion
                    </button>
                )}
            </header>

            <nav className="legal-nav">
                <a href="#privacy">Confidentialité</a>
                <a href="#terms">Conditions d'utilisation</a>
                <a href="#mentions">Mentions légales</a>
            </nav>

            <main className="legal-content">
                <section id="privacy" className="legal-section">
                    <h2>Politique de Confidentialité</h2>
                    <p className="humain-touch">Nous attachons une importance capitale à la protection de vos données personnelles et au respect de votre vie privée.</p>

                    <h3>Données collectées</h3>
                    <ul>
                        <li><strong>Identité :</strong> Nom, prénom, adresse e-mail et pseudonyme.</li>
                        <li><strong>Dossiers de signalement :</strong> Contenu des signalements, témoignages et pièces jointes (documents, images, etc.).</li>
                    </ul>

                    <h3>Finalités du traitement</h3>
                    <p>Vos données sont exclusivement utilisées pour assurer la gestion, l'instruction et le suivi des signalements déposés sur la plateforme par les services RH et Juridiques.</p>

                    <h3>Destinataires des données</h3>
                    <p>L'accès aux données est strictement limité aux personnels habilités des directions des Ressources Humaines et Juridiques, ainsi qu'aux administrateurs techniques du projet. Aucune donnée n'est transmise à des tiers à des fins commerciales.</p>

                    <h3>Vos Droits (RGPD)</h3>
                    <p>Conformément à la réglementation européenne, vous disposez des droits suivants concernant vos données :</p>
                    <div className="rights-grid">
                        <div className="right-item">
                            <h4>Droit d'accès</h4>
                            <p>Vous pouvez obtenir la confirmation que vos données sont traitées et en obtenir une copie.</p>
                        </div>
                        <div className="right-item">
                            <h4>Droit de rectification</h4>
                            <p>Vous avez le droit de demander la correction de données inexactes ou incomplètes vous concernant.</p>
                        </div>
                        <div className="right-item">
                            <h4>Droit à l'effacement</h4>
                            <p>Également appelé "droit à l'oubli", il vous permet de demander la suppression de vos données dans certaines conditions.</p>
                        </div>
                        <div className="right-item">
                            <h4>Droit à la limitation</h4>
                            <p>Vous pouvez demander de geler temporairement l'utilisation de certaines de vos données.</p>
                        </div>
                        <div className="right-item">
                            <h4>Droit à la portabilité</h4>
                            <p>Vous pouvez demander à récupérer vos données dans un format structuré pour les transmettre à un autre service.</p>
                        </div>
                        <div className="right-item">
                            <h4>Droit d'opposition</h4>
                            <p>Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes liés à votre situation particulière.</p>
                        </div>
                    </div>
                </section>

                <hr />

                <section id="terms" className="legal-section">
                    <h2>Conditions Générales d'Utilisation</h2>
                    <p className="humain-touch">Un cadre de confiance pour un usage responsable et serein.</p>

                    <h3>Usage de la plateforme</h3>
                    <p>Cette plateforme est dédiée au recueil de signalements professionnels. Les utilisateurs s'engagent à agir de bonne foi et à fournir des informations aussi précises que possible.</p>

                    <h3>Responsabilité de l'utilisateur</h3>
                    <p>L'utilisateur est seul responsable des propos tenus et des documents partagés. Tout usage abusif, diffamatoire ou malveillant pourra faire l'objet de mesures appropriées.</p>

                    <h3>Propriété Intellectuelle</h3>
                    <p>L'ensemble des éléments (textes, logos, code source) est la propriété exclusive du projet LegalTech. Toute reproduction totale ou partielle sans autorisation est interdite.</p>
                </section>

                <hr />

                <section id="mentions" className="legal-section">
                    <h2>Mentions Légales</h2>
                    <p><strong>Éditeur :</strong> Projet LegalTech - Étudiants BTS SIO 2.</p>
                    <p><strong>Responsable de publication :</strong> Équipe Projet LegalTech.</p>
                    <p><strong>Hébergement :</strong> Infrastructure locale conteneurisée (Docker).</p>
                    <p><strong>Contact :</strong> technique@legaltech.local</p>
                </section>
            </main>

            <footer className="legal-footer">
                <p>&copy; {new Date().getFullYear()} LegalTech Platform. Pour un web plus transparent.</p>
            </footer>
        </div>
    );
};

export default LegalDocuments;
