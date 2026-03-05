import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Signalements from './pages/Signalements';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import SignalementDetail from './pages/SignalementDetail';
import Login from './pages/Login'; // nouvelle page de login
import './styles/App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedReportId, setSelectedReportId] = useState(null);

    // Fonction pour changer de page
    const handleNavigate = (pageId, reportId = null) => {
        setCurrentPage(pageId);
        if (reportId) {
            setSelectedReportId(reportId);
        }
    };

    // Rendu de la page active
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard user={user} />;
            case 'signalements':
                return <Signalements user={user} onNavigate={handleNavigate} />;
            case 'details':
                return <SignalementDetail reportId={selectedReportId} onBack={() => setCurrentPage('signalements')} />;
            case 'profil':
                return <Profil user={user} />;
            case 'parametres':
                return <Parametres user={user} />;
            default:
                return <Dashboard user={user} />;

        }
    };

    // Vérifie si un user est déjà stocké dans localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // À chaque changement de user, on met à jour localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Fonction pour se déconnecter
    const handleLogout = () => {
        setUser(null); // supprime le state
        localStorage.removeItem("user"); // supprime le stockage local
    };

    // Si l'utilisateur n'est pas connecté → afficher Login
    if (!user) {
        return <Login onLogin={setUser} />;
    }

    // Si rôle non autorisé (optionnel)
    console.log(user);
    if (!["RH", "Juriste"].includes(user.statut)) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
                <button className="return-button" onClick={handleLogout}>
                    Retourner à la page de connexion
                </button>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar onNavigate={handleNavigate} currentPage={currentPage} user={user} onLogout={handleLogout} />
            <main className="main-content">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
