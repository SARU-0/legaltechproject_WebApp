import React, { useState } from "react";
import '../styles/Login.css';
import CryptoJS from 'crypto-js';
import logo from '../assets/logo.png';

// Composant Login : Gère l'authentification des utilisateurs
const Login = ({ onLogin, onNavigate }) => {
    // États pour les identifiants et la gestion d'erreur/chargement
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fonction de soumission du formulaire de connexion
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Hachage du mot de passe en SHA-256 pour ne jamais envoyer le texte brut sur le réseau
        const hashedPassword = CryptoJS.SHA256(password).toString();

        try {
            // Appel API vers le backend Node.js
            const res = await fetch("http://localhost:8081/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, hashedPassword })
            });

            if (!res.ok) throw new Error("Identifiants incorrects");
            const data = await res.json();

            // Délai artificiel pour une transition visuelle plus fluide
            setTimeout(() => {
                onLogin(data);
            }, 500);

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Partie visuelle / de marque (gauche sur desktop) */}
            <div className="login-visual">
                <div className="login-visual-content">
                    <img src={logo} alt="Logo LegalTech" className="login-logo" />
                    <h1>LegalTech<br />Platform</h1>
                    <p>Votre portail unifié pour la gestion juridique et RH.</p>
                </div>
                <div className="login-visual-bg"></div>
            </div>

            {/* Formulaire de connexion (droite sur desktop) */}
            <div className="login-form-container">
                <div className="login-card">
                    <div className="login-header">
                        <img src={logo} alt="Logo LegalTech" className="login-logo-mobile" />
                        <h2>Bienvenue 👋</h2>
                        <p>Connectez-vous pour accéder à votre espace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label>Identifiant</label>
                            <input
                                type="text"
                                placeholder="nom.prenom@entreprise.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="login-error-message">{error}</div>}

                        <button
                            type="submit"
                            className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Problème de connexion ? <a href="#">Contactez le support</a></p>
                        <div className="legal-links">
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('legal'); }}>Confidentialité</a>
                            <span> • </span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('legal'); }}>CGU</a>
                            <span> • </span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('legal'); }}>Mentions Légales</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

