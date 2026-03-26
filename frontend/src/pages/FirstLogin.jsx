import React, { useState, useEffect } from "react";
import CryptoJS from 'crypto-js';
import { ShieldCheck, Info, CheckCircle2, XCircle } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/FirstLogin.css';

// Page FirstLogin : Écran forcé lors de la toute première connexion d'un utilisateur
// Il doit définir son pseudo public et changer son mot de passe provisoire
const FirstLogin = ({ user, onFinish }) => {
    // État pour les champs de saisie
    const [formData, setFormData] = useState({
        pseudo: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // État pour gérer la liste des critères de sécurité du mot de passe
    const [checks, setChecks] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
        match: false
    });

    // Effet qui s'exécute à chaque saisie pour valider la force du mot de passe
    useEffect(() => {
        const { password, confirmPassword } = formData;
        setChecks({
            length: password.length >= 16, // Minimum 16 caractères
            upper: /[A-Z]/.test(password), // Au moins une majuscule
            lower: /[a-z]/.test(password), // Au moins une minuscule
            number: /[0-9]/.test(password), // Au moins un chiffre
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password), // Au moins un caractère spécial
            match: password !== "" && password === confirmPassword // Les deux entrées correspondent
        });
    }, [formData]);

    // Détermine si tous les critères sont au vert
    const isPasswordValid = Object.values(checks).every(Boolean);

    // Finalisation du profil
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        setLoading(true);
        setError("");

        // Génération d'un salt (sel) aléatoire de 16 octets, encodé en Base64 (équivalent Java SecureRandom)
        const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
        
        // Hachage simple du mot de passe (le sel sera utilisé lors de la comparaison sur le serveur)
        const hashedPassword = CryptoJS.SHA256(formData.password).toString();

        try {
            // Signalement au backend que l'utilisateur a fini son "onboarding"
            const res = await fetch("http://localhost:8081/finish-onboarding", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    IdUtil: user.IdUtil,
                    pseudo: formData.pseudo,
                    newPassword: hashedPassword,
                    salt: salt
                })
            });

            if (!res.ok) throw new Error("Erreur lors de la finalisation du profil");

            // Mise à jour de l'objet utilisateur pour supprimer le flag 'isFirstLog'
            const updatedUser = { ...user, isFirstLog: 0, pseudo: formData.pseudo };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // On informe le parent (App.jsx) que la configuration est finie
            onFinish(updatedUser);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Petit composant interne pour afficher une ligne de la checklist
    const CheckItem = ({ label, met }) => (
        <div className={`check-item ${met ? 'met' : ''}`}>
            {met ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{label}</span>
        </div>
    );

    return (
        <div className="onboarding-page">
            <div className="onboarding-glass-card">
                <div className="onboarding-header">
                    <div className="security-icon-box">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>Sécurisez votre compte</h1>
                    <p>C'est votre première connexion. Veuillez choisir un pseudo et un mot de passe robuste.</p>
                </div>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="onboarding-form">
                    <div className="field-group">
                        <label>Choisissez un pseudo</label>
                        <input
                            type="text"
                            placeholder="Votre pseudo public"
                            value={formData.pseudo}
                            onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label>Confirmez le mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    {/* Checklist des contraintes de sécurité */}
                    <div className="password-checklist">
                        <div className="checklist-title">
                            <Info size={14} />
                            Exigences de sécurité :
                        </div>
                        <div className="checklist-grid">
                            <CheckItem label="16 caractères minimum" met={checks.length} />
                            <CheckItem label="Une majuscule" met={checks.upper} />
                            <CheckItem label="Une minuscule" met={checks.lower} />
                            <CheckItem label="Un chiffre" met={checks.number} />
                            <CheckItem label="Un caractère spécial" met={checks.special} />
                            <CheckItem label="Mots de passe identiques" met={checks.match} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="onboarding-submit-btn"
                        disabled={loading || !isPasswordValid}
                    >
                        {loading ? "Configuration..." : "Finaliser mon profil"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FirstLogin;

