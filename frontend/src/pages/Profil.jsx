import React from 'react';
import { Mail, Phone, MapPin, Calendar, Edit2 } from 'lucide-react';
import '../Pages.css';

const Profil = ({user}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profil</h1>
          <p className="page-subtitle">Gérez vos informations personnelles</p>
        </div>
        <button className="primary-btn">
          <Edit2 size={18} />
          Modifier le profil
        </button>
      </div>

      <div className="profile-layout">
        {/* Card Profil Principal */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span>JD</span>
            </div>
            <div className="profile-info-main">
              <h2>{user.nom} {user.prenom}</h2>
              <p>{user.statut}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <Mail size={20} className="detail-icon" />
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">{user.email}</p>
              </div>
            </div>

            <div className="detail-item">
              {/*
              <Phone size={20} className="detail-icon" />
              <div>
                <p className="detail-label">Téléphone</p>
                <p className="detail-value">+33 6 12 34 56 78</p>
              </div>
            </div>

            <div className="detail-item">
              <MapPin size={20} className="detail-icon" />
              <div>
                <p className="detail-label">Localisation</p>
                <p className="detail-value">Paris, France</p>
              </div>
            </div>

            <div className="detail-item">
              <Calendar size={20} className="detail-icon" />
              <div>
                <p className="detail-label">Membre depuis</p>
                <p className="detail-value">Janvier 2024</p>
              </div>
              */}
            </div>
          </div>
        </div>

        {/* Stats & Activité */}
        <div className="profile-stats">
          <div className="stat-box">
            <h3>42</h3>
            <p>Signalements traités</p>
          </div>
          <div className="stat-box">
            <h3>1.2k</h3>
            <p>Actions effectuées</p>
          </div>
          <div className="stat-box">
            <h3>98%</h3>
            <p>Taux de satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
