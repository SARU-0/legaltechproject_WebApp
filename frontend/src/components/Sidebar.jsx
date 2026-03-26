import React, { useEffect, useState } from 'react';
import { Home, AlertCircle, User, Settings, ChevronLeft, ChevronRight, LogOut, UserRoundPlus, Sun, Moon, FileText } from 'lucide-react';
import '../styles/Sidebar.css';
import logo from '../assets/logo.png';

// Composant Sidebar : Gère la navigation latérale de l'application
const Sidebar = ({ onNavigate, currentPage, user, onLogout, isDarkMode, toggleTheme }) => {
    // État pour savoir si la barre est repliée (isCollapsed)
    const [isCollapsed, setIsCollapsed] = useState(false);
    // État pour stocker le nombre total de signalements (affiché en badge)
    const [nb_signalement, setNb_signalement] = useState(0);

    // Récupère le nombre de signalements au chargement du composant
    useEffect(() => {
        fetch("http://localhost:8081/reports/count")
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setNb_signalement(data[0].nb_signalement);
                }
            })
            .catch(err => console.error("Erreur compte signalements:", err));
    }, []);

    // Définition des éléments du menu de navigation
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            badge: null
        },
        {
            id: 'signalements',
            label: 'Signalements',
            icon: AlertCircle,
            // Affiche un badge numérique s'il y a des signalements
            badge: nb_signalement > 0 ? nb_signalement : null
        },
        {
            id: 'profil',
            label: 'Profil',
            icon: User,
            badge: null
        },
        {
            id: 'createUser',
            label: 'Créer Utilisateur',
            icon: UserRoundPlus,
            badge: null,
        },
        {
            id: 'parametres',
            label: 'Paramètres',
            icon: Settings,
            badge: null
        },
        {
            id: 'legal',
            label: 'Légal',
            icon: FileText,
            badge: null
        }
    ];

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* En-tête de la Sidebar avec Logo et bouton de repli */}
            <div className="sidebar-header">
                <div className={`logo-section ${isCollapsed ? 'hidden' : ''}`}>
                    <div className="logo">
                        <img src={logo} alt="Logo" className="sidebar-logo-img" />
                    </div>
                    <div className="logo-text">
                        <h1>LegalTech</h1>
                        <p>Administration</p>
                    </div>
                </div>

                {/* Bouton pour réduire ou agrandir la barre latérale */}
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation principale : Liste les boutons du menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <Icon className="nav-icon" size={20} />

                            {/* N'affiche le texte et le badge que si la barre n'est pas repliée */}
                            {!isCollapsed && (
                                <>
                                    <span className="nav-label">{item.label}</span>
                                    {item.badge && (
                                        <span className="nav-badge">{item.badge}</span>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}

                {/* Lien spécifique pour l'Admin vers le Staff Onboarding */}
                {user.IdStatutUtil === 4 && (
                    <button
                        className={`nav-item ${window.location.hash === '#register-staff' ? 'active' : ''}`}
                        onClick={() => {
                            window.location.hash = '#register-staff';
                            // Note: App.jsx listens for hashchange and updates isRegisterStaff
                        }}
                        style={{ animationDelay: `${menuItems.length * 60}ms`, marginTop: '12px', borderTop: '1px solid var(--border-color, #e5e7eb)20', paddingTop: '12px' }}
                    >
                        <UserRoundPlus className="nav-icon" size={20} />
                        {!isCollapsed && <span className="nav-label">Compte Gestionnaire</span>}
                    </button>
                )}
            </nav>

            <div className="sidebar-divider"></div>

            {/* Section Raccourcis : Thème et Déconnexion */}
            {!isCollapsed && (
                <div className="sidebar-shortcuts">
                    <p className="shortcuts-title">Raccourcis</p>
                    {/* Bouton switch Mode Clair / Sombre */}
                    <button className="nav-item" onClick={toggleTheme}>
                        {isDarkMode ? <Sun className="nav-icon" size={20} /> : <Moon className="nav-icon" size={20} />}
                        <span className="nav-label">{isDarkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
                    </button>
                    {/* Bouton de déconnexion */}
                    <button className="nav-item" onClick={onLogout}>
                        <LogOut className="nav-icon" size={20} />
                        <span className="nav-label">Déconnexion</span>
                    </button>
                </div>
            )}

            {/* Bas de la Sidebar : Profil de l'utilisateur connecté */}
            <div className="sidebar-footer">
                <div className={`user-profile ${isCollapsed ? 'centered' : ''}`}>
                    {/* Avatar généré à partir des initiales */}
                    <div className="user-avatar">
                        <span>{user.prenom ? user.prenom[0].toUpperCase() : ''}{user.nom ? user.nom[0].toUpperCase() : ''}</span>
                    </div>

                    {!isCollapsed && (
                        <div className="user-info">
                            <p className="user-name">{user.prenom} {user.nom}</p>
                            <p className="user-email">{user.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
