import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Signalements from './pages/Signalements';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import SignalementDetail from './pages/SignalementDetail';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import RegisterStaff from './pages/RegisterStaff';
import FirstLogin from './pages/FirstLogin';
import LegalDocuments from './pages/LegalDocuments';
import './styles/App.css';

// Composant racine de l'application
function App() {
    // État pour savoir quelle page afficher (par défaut : tableau de bord)
    const [currentPage, setCurrentPage] = useState('dashboard');
    
    // Vérifie si l'URL contient #register-staff pour afficher la page d'inscription spéciale
    const [isRegisterStaff, setIsRegisterStaff] = useState(window.location.hash === '#register-staff');

    // Écoute les changements d'ancre dans l'URL (#) pour mettre à jour l'affichage si besoin
    useEffect(() => {
        const handleHashChange = () => {
            setIsRegisterStaff(window.location.hash === '#register-staff');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // État pour stocker l'ID du signalement sélectionné pour la page de détails
    const [selectedReportId, setSelectedReportId] = useState(null);
    
    // État pour le mode sombre, initialisé à partir du stockage local (localStorage)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === 'dark';
    });

    // Effet pour appliquer ou retirer la classe 'dark' sur le body quand le thème change
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem("theme", 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem("theme", 'light');
        }
    }, [isDarkMode]);

    // Alterne entre mode clair et mode sombre
    const toggleTheme = () => setIsDarkMode(prev => !prev);

    // Fonction globale pour changer de page (appelée depuis les composants enfants)
    const handleNavigate = (pageId, reportId = null) => {
        setCurrentPage(pageId);
        if (reportId) {
            setSelectedReportId(reportId);
        }
    };

    // Logique de rendu conditionnel : retourne le bon composant selon currentPage
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard user={user} onNavigate={handleNavigate} />;
            case 'signalements':
                return <Signalements user={user} onNavigate={handleNavigate} />;
            case 'details':
                return <SignalementDetail reportId={selectedReportId} onBack={() => setCurrentPage('signalements')} user={user} />;
            case 'profil':
                return <Profil user={user} />;
            case 'parametres':
                return <Parametres user={user} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
            case 'createUser':
                return <CreateUser user={user} onNavigate={handleNavigate} />;
            case 'legal':
                return <LegalDocuments onBack={user ? null : () => setCurrentPage('dashboard')} />;
            default:
                return <Dashboard user={user} onNavigate={handleNavigate} />;
        }
    };

    // État de l'utilisateur connecté, récupéré du localStorage si existant
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Sauvegarde l'utilisateur dans localStorage à chaque modification du state user
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Gère la déconnexion en vidant le state et le stockage local
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        setCurrentPage('dashboard');
    };

    // Cas spécial : Page d'inscription pour le personnel (Seulement pour Admin)
    if (isRegisterStaff) {
        if (user && user.IdStatutUtil === 4) {
            return <RegisterStaff user={user} />;
        }
        return (
            <div style={{ textAlign: "center", marginTop: "100px", zIndex: 50, position: 'relative' }}>
                <p style={{ marginBottom: "20px", fontSize: "18px" }}>Vous n'êtes pas autorisé à accéder à cette page d'administration.</p>
                <button className="return-button" onClick={() => { window.location.hash = ""; setIsRegisterStaff(false); }}>
                    Retour au tableau de bord
                </button>
            </div>
        );
    }

    // Cas spécial : Première connexion, l'utilisateur doit changer son mot de passe
    if (user && user.isFirstLog === 1) {
        return <FirstLogin user={user} onFinish={setUser} />;
    }

    // Si pas d'utilisateur connecté, on affiche la page de login (ou la page légale si demandée)
    if (!user) {
        if (currentPage === 'legal') {
            return <LegalDocuments onBack={() => setCurrentPage('dashboard')} />;
        }
        return <Login onLogin={setUser} onNavigate={handleNavigate} />;
    }

    // Sécurité : Vérifie que l'utilisateur a un rôle autorisé (RH, Juriste ou Admin)
    if (!["RH", "Juriste", "Admin"].includes(user.statut)) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px", zIndex: 50, position: 'relative' }}>
                <p style={{ marginBottom: "20px", fontSize: "18px" }}>Vous n'êtes pas autorisé à accéder à cette page.</p>
                <button className="return-button" onClick={handleLogout}>
                    Retourner à la page de connexion
                </button>
            </div>
        );
    }

    // Structure principale avec Sidebar et zone de contenu dynamique
    return (
        <div className="app-wrapper">
            <div className="app-bg-decoration"></div>
            <div className="app-bg-decoration secondary"></div>

            <div className="sidebar-container">
                <Sidebar
                    onNavigate={handleNavigate}
                    currentPage={currentPage}
                    user={user}
                    onLogout={handleLogout}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />
            </div>

            <div className="main-content-wrapper">
                <main className="main-content-card">
                    {/* Affichage de la page sélectionnée via renderPage() */}
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}


export default App;

