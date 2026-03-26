import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import '../styles/SharedPages.css';
import '../styles/CreateUser.css';

// Page CreateUser : Permet aux administrateurs (RH/Juristes) de créer de nouveaux comptes utilisateurs
const CreateUser = ({ user, onNavigate }) => {
    // État pour stocker les informations saisies dans le formulaire
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    // État pour afficher le mot de passe généré après succès
    const [successPassword, setSuccessPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Fonction utilitaire pour générer un mot de passe robuste de manière aléatoire
    const generateRandomPassword = (length = 12) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };

    // Sécurité : Vérifie que l'utilisateur actuel a bien les droits d'administration
    if (!["RH", "Juriste", "Admin"].includes(user.statut)) {
        return (
            <div className="page-container">
                <div className="error-message">
                    Accès refusé. Vous n'avez pas les droits nécessaires pour créer un utilisateur.
                </div>
            </div>
        );
    }

    // Gestion de la soumission du formulaire de création
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessPassword("");
        setLoading(true);

        // 1. Génération d'un mot de passe provisoire
        const tempPassword = generateRandomPassword();
        // 2. Hachage du mot de passe en SHA-256 avant envoi au serveur (sécurité)
        const hashedPassword = CryptoJS.SHA256(tempPassword).toString();

        try {
            // 3. Appel à l'API backend pour enregistrer l'utilisateur
            const res = await fetch("http://localhost:8081/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    password: hashedPassword
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Erreur lors de la création de l'utilisateur");
            }

            // 4. Succès : On affiche le mot de passe en clair à l'admin pour qu'il puisse le transmettre
            setSuccessPassword(tempPassword);

            // Réinitialisation du formulaire
            setFormData({ nom: "", prenom: "", email: "", password: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="create-user-container">
                <h1 className="create-user-title">Créer un utilisateur</h1>
                <p className="create-user-subtitle">Ajoutez un nouveau membre à la plateforme de bureau LegalTech</p>

                {error && <div className="error-message">{error}</div>}

                {/* Si création réussie, on affiche le mot de passe généré */}
                {successPassword ? (
                    <div className="success-message">
                        <h3>Utilisateur créé avec succès !</h3>
                        <p>Mot de passe provisoire :</p>
                        <div className="password-box">
                            <span className="password-text">{successPassword}</span>
                            <button
                                type="button"
                                className="copy-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(successPassword);
                                    alert("Mot de passe copié !");
                                }}
                            >
                                Copier
                            </button>
                        </div>
                        <p className="warning-text" style={{ marginBottom: "20px" }}>Notez-le bien, il ne sera plus affiché !</p>
                        <button
                            type="button"
                            className="submit-btn"
                            style={{ margin: 0, width: "100%", marginTop: "20px" }}
                            onClick={() => setSuccessPassword("")}
                        >
                            Créer un autre utilisateur
                        </button>
                    </div>
                ) : (
                    /* Formulaire de saisie standard */
                    <form onSubmit={handleSubmit} className="create-user-form">
                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Ex: SARBACH"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Prénom</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Ex: Théo"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email professionnel</label>
                            <input
                                className="form-input"
                                type="email"
                                placeholder="theo@entreprise.fr"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="mdp-label">Le mot de passe sera généré automatiquement et vous sera affiché après validation.</label>
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Création en cours..." : "Créer l'utilisateur"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateUser;

