import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/Signalements.css';

const Signalements = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/reports")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error(err));
  }, []);

  // Fonction pour obtenir la config du statut (icône, couleur, badge)
  const getStatusConfig = (statut) => {
    switch (statut) {
      case 'En attente':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          label: 'En attente'
        };
      case 'En cours':
        return {
          icon: AlertCircle,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          label: 'En cours'
        };
      case 'Résolu':
        return {
          icon: CheckCircle,
          color: '#10b981',
          bgColor: '#d1fae5',
          label: 'Résolu'
        };
      case 'Envoyé':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          label: 'Envoyé'
        };
      case 'Pris en charge':
        return {
          icon: AlertCircle,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          label: 'Pris en charge'
        };
      default:
        return {
          icon: XCircle,
          color: '#6b7280',
          bgColor: '#f3f4f6',
          label: statut
        };
    }
  };

  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (categorie) => {
    switch (categorie) {
      case 'Harcèlement':
        return '#ef4444';
      case 'Discrimination':
        return '#f59e0b';
      case 'Conflits d\'intérêts':
        return '#8408eaff';
      case 'Corruption':
        return '#dc2626';
      default:
        return '#667eea';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Signalements</h1>
          <p className="page-subtitle">Gérez tous vos signalements ici</p>
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="signalements-list">
        {reports.length === 0 ? (
          <div className="empty-state">
            <p>Aucun signalement trouvé</p>
          </div>
        ) : (
          reports.map((item, index) => {
            const statusConfig = getStatusConfig(item.StatutSi);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={item.idSignalement}
                className="signalement-card"
                style={{
                  animationDelay: `${index * 50}ms`,
                  borderLeftColor: getCategoryColor(item.Categorie),
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid'
                }}
              >
                <div className="signalement-header">
                  <h3 className="signalement-title">{item.Titre}</h3>
                  <span
                    className="signalement-badge"
                    style={{
                      backgroundColor: statusConfig.bgColor,
                      color: statusConfig.color
                    }}
                  >
                    <StatusIcon size={16} />
                    {statusConfig.label}
                  </span>
                </div>

                <p className="signalement-description">{item.Description}</p>

                <div className="signalement-meta">
                  <span className="signalement-category" style={{ color: getCategoryColor(item.Categorie) }}>
                    {item.Categorie}
                  </span>
                </div>

                <div className="signalement-footer">
                  <span className="signalement-user">👤 Utilisateur {item.idUtil}</span>
                  <span className="signalement-date">📅 {new Date(item.Date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Signalements;