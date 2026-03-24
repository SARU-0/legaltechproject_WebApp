import React from 'react';
import { Mail } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/Profil.css';

// Page Profil : Affiche les informations personnelles de l'utilisateur connecté
const Profil = ({ user }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profil</h1>
          <p className="page-subtitle">Gérez vos informations personnelles</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar-section">
            {/* Génération de l'avatar avec les initiales */}
            <div className="profile-avatar-large">
              <span>{user.prenom ? user.prenom[0].toUpperCase() : ''}{user.nom ? user.nom[0].toUpperCase() : ''}</span>
            </div>
            <div className="profile-info-main">
              <h2>{user.nom} {user.prenom}</h2>
              <p>{user.statut}</p>
            </div>
          </div>

          <div className="profile-details">
            {/* Champ Email */}
            <div className="detail-item">
              <Mail size={20} className="detail-icon" />
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">{user.email}</p>
              </div>
            </div>

            {/* Champ Pseudo */}
            <div className="detail-item">
              <div className="detail-icon-wrapper">@</div>
              <div>
                <p className="detail-label">Pseudo</p>
                <p className="detail-value">{user.pseudo || 'Non défini'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;

