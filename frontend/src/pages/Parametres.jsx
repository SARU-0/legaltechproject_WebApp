import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/Parametres.css';

// Page Paramètres : Permet de configurer les préférences de l'utilisateur (ex: mode sombre)
const Parametres = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Configurez votre application</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-section">
          {/* Section Apparence */}
          <div className="settings-section-header">
            <Moon size={20} />
            <h3>Apparence</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <p className="settings-item-title">Mode sombre</p>
              <p className="settings-item-desc">Activer le thème sombre sur toute l'interface</p>
            </div>
            {/* Interrupteur (Toggle) pour le thème */}
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametres;

