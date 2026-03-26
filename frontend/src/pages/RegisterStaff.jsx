import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import '../styles/SharedPages.css';
import '../styles/RegisterStaff.css';

// Page RegisterStaff : Page spécifique pour l'inscription de nouveaux membres du staff (RH/Juristes)
const RegisterStaff = () => {
    // État du formulaire d'inscription
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        roleId: 2 // Par défaut : Ressources Humaines
    });
    const [error, setError] = useState("");
    const [successPassword, setSuccessPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Fonction de génération d'un mot de passe aléatoire très sécurisé (16 caractères)
    const generateRandomPassword = (length = 16) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessPassword("");
        setLoading(true);

        // 1. Génération du MDP provisoire
        const tempPassword = generateRandomPassword();
        // 2. Hachage SHA-256
        const hashedPassword = CryptoJS.SHA256(tempPassword).toString();

        try {
            // 3. Enregistrement via l'API sign-up
            const res = await fetch("http://localhost:8081/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    password: hashedPassword,
                    IdStatutUtil: parseInt(formData.roleId)
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Erreur lors de l'inscription");
            }

            // Affichage du MDP généré à l'écran
            setSuccessPassword(tempPassword);
            // Reset du formulaire
            setFormData({ nom: "", prenom: "", email: "", roleId: 2 });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-staff-page">
            <div className="staff-scroll-wrapper">
                <div className="onboarding-card">
                    <div className="onboarding-header">
                        <div className="onboarding-badge">Staff Onboarding</div>
                        <h1>Rejoindre LegalTech</h1>
                        <p>Enregistrez un nouveau membre de l'équipe (RH ou Juriste)</p>
                    </div>

                    {error && <div className="staff-error-box">{error}</div>}

                    {/* Affichage du mot de passe en cas de succès */}
                    {successPassword ? (
                        <div className="staff-success-box-large">
                            <h3>Compte créé avec succès !</h3>
                            <p>Mot de passe provisoire à transmettre au membre :</p>
                            <div className="password-display-box">
                                <span className="pwd-text">{successPassword}</span>
                                <button
                                    type="button"
                                    className="pwd-copy-btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(successPassword);
                                        alert("Mot de passe copié !");
                                    }}
                                >
                                    Copier
                                </button>
                            </div>
                            <p className="staff-warning-text">L'utilisateur devra changer son mot de passe lors de sa première connexion.</p>
                            <button
                                type="button"
                                className="staff-submit-btn"
                                style={{ width: "100%", marginTop: "24px" }}
                                onClick={() => setSuccessPassword("")}
                            >
                                Enregistrer un autre membre
                            </button>
                        </div>
                    ) : (
                        /* Formulaire d'inscription */
                        <form onSubmit={handleSubmit} className="staff-form">
                            <div className="staff-form-row">
                                <div className="staff-form-group">
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        placeholder="Nom de famille"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="staff-form-group">
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="staff-form-group">
                                <label>Email Professionnel</label>
                                <input
                                    type="email"
                                    placeholder="email@legaltech.fr"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Choix du rôle (RH ou Juriste) */}
                            <div className="staff-form-group">
                                <label>Rôle Professionnel</label>
                                <select
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                    className="staff-select"
                                >
                                    <option value={2}>Ressources Humaines (RH)</option>
                                    <option value={3}>Juriste Administration</option>
                                </select>
                            </div>

                            <div className="staff-info-alert">
                                Un mot de passe sécurisé sera généré automatiquement.
                            </div>

                            <button type="submit" className="staff-submit-btn" disabled={loading}>
                                {loading ? "Création..." : "Enregistrer le membre"}
                            </button>
                            
                            <p className="staff-footer-note">
                                Cette page est réservée à l'administration interne.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterStaff;

