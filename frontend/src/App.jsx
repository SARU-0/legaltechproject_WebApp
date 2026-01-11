import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Signalements from './pages/Signalements';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Fonction pour changer de page
    const handleNavigate = (pageId) => {
        setCurrentPage(pageId);
    };

    // Rendu de la page active
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'signalements':
                return <Signalements />;
            case 'profil':
                return <Profil />;
            case 'parametres':
                return <Parametres />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app-container">
            <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
            <main className="main-content">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;