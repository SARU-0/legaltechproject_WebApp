import React, { useState } from 'react';
import { Home, AlertCircle, User, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ onNavigate, currentPage }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

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
            badge: 12
        },
        {
            id: 'profil',
            label: 'Profil',
            icon: User,
            badge: null
        },
        {
            id: 'parametres',
            label: 'Paramètres',
            icon: Settings,
            badge: null
        }
    ];

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className={`logo-section ${isCollapsed ? 'hidden' : ''}`}>
                    <div className="logo">
                        <span>A</span>
                    </div>
                    <div className="logo-text">
                        <h1>AppName</h1>
                        <p>Administration</p>
                    </div>
                </div>

                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
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
            </nav>

            <div className="sidebar-divider"></div>

            {/* Section secondaire */}
            {!isCollapsed && (
                <div className="sidebar-shortcuts">
                    <p className="shortcuts-title">Raccourcis</p>
                    <button className="nav-item">
                        <LogOut className="nav-icon" size={20} />
                        <span className="nav-label">Déconnexion</span>
                    </button>
                </div>
            )}

            {/* Footer avec profil */}
            <div className="sidebar-footer">
                <div className={`user-profile ${isCollapsed ? 'centered' : ''}`}>
                    <div className="user-avatar">
                        <span>JD</span>
                    </div>

                    {!isCollapsed && (
                        <div className="user-info">
                            <p className="user-name">Jean Dupont</p>
                            <p className="user-email">jean@example.com</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;