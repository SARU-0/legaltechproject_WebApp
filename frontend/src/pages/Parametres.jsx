import React, { useState } from 'react';
import { Bell, Lock, Globe, Moon, Shield, Mail } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/Parametres.css';

const Parametres = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: false,
    twoFactor: true,
    language: 'fr'
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Configurez votre application</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Section Notifications */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Bell size={20} />
            <h3>Notifications</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <p className="settings-item-title">Notifications push</p>
              <p className="settings-item-desc">Recevez des notifications sur votre appareil</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => toggleSetting('notifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <p className="settings-item-title">Alertes email</p>
              <p className="settings-item-desc">Recevez un résumé hebdomadaire par email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => toggleSetting('emailAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Section Sécurité */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Shield size={20} />
            <h3>Sécurité</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <p className="settings-item-title">Authentification à deux facteurs</p>
              <p className="settings-item-desc">Sécurisez votre compte avec 2FA</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={() => toggleSetting('twoFactor')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item clickable">
            <div className="settings-item-info">
              <Lock size={18} className="settings-item-icon" />
              <div>
                <p className="settings-item-title">Changer le mot de passe</p>
                <p className="settings-item-desc">Dernière modification il y a 3 mois</p>
              </div>
            </div>
            <span className="settings-arrow">›</span>
          </div>
        </div>

        {/* Section Apparence */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Moon size={20} />
            <h3>Apparence</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <p className="settings-item-title">Mode sombre</p>
              <p className="settings-item-desc">Activer le thème sombre</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => toggleSetting('darkMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item clickable">
            <div className="settings-item-info">
              <Globe size={18} className="settings-item-icon" />
              <div>
                <p className="settings-item-title">Langue</p>
                <p className="settings-item-desc">Français</p>
              </div>
            </div>
            <span className="settings-arrow">›</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger">
          <div className="settings-section-header">
            <h3>Zone dangereuse</h3>
          </div>

          <button className="danger-btn">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
