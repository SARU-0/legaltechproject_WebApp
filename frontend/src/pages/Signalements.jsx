import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, Filter, ChevronRight, LoaderCircle } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/Signalements.css';

// Page Signalements : Affiche la liste complète des signalements avec filtres
const Signalements = ({ onNavigate, user }) => {
  // Liste des signalements récupérés
  const [reports, setReports] = useState([]);
  // État de chargement
  const [isLoading, setIsLoading] = useState(true);
  // Affichage ou non du panneau de filtres
  const [showFilters, setShowFilters] = useState(false);
  // Statut sélectionné pour le filtrage
  const [filterStatus, setFilterStatus] = useState("Tous");
  // Option pour masquer les dossiers déjà pris par d'autres collègues RH
  const [hideOtherHR, setHideOtherHR] = useState(false);
  // État du menu déroulant personnalisé
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Options possibles pour le filtre de statut
  const statusOptions = ["Tous", "Envoyé", "Pris en charge", "Traitement en cours", "Résolu"];

  // Récupération des signalements au chargement
  useEffect(() => {
    fetch("http://localhost:8081/reports")
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Fonction utilitaire pour configurer l'icône et le style selon le statut
  const getStatusConfig = (statut) => {
    switch (statut) {
      case 'En attente':
      case 'Envoyé':
        return { icon: Clock, className: 'status-pending', label: statut };
      case 'Traitement en cours':
        return { icon: LoaderCircle, className: 'status-processing', label: 'Traitement en cours' }
      case 'Pris en charge':
        return { icon: AlertCircle, className: 'status-active', label: statut };
      case 'Résolu':
        return { icon: CheckCircle, className: 'status-resolved', label: 'Résolu' };
      default:
        return { icon: XCircle, className: 'status-default', label: statut };
    }
  };

  // Logique de filtrage des signalements (Statut + Masquage dossiers pris)
  const filteredReports = reports.filter(report => {
    // 1. Filtre par statut
    if (filterStatus !== "Tous" && report.LibelleStatutSi !== filterStatus) {
      return false;
    }

    // 2. Filtre "Masquer les dossiers d'autres RH"
    if (hideOtherHR) {
      const isTakenByOther = (report.LibelleStatutSi === "Pris en charge" || report.LibelleStatutSi === "Traitement en cours") && 
                              report.IdResponsable && 
                              report.IdResponsable !== user.IdUtil;
      if (isTakenByOther) return false;
    }

    return true;
  });

  // Détermine la couleur de la catégorie pour le design
  const getCategoryColor = (categorie) => {
    switch (categorie) {
      case 'Harcèlement': return '#ff0000';
      case 'Discrimination': return '#002aff';
      case 'Conflits d\'intérêts': return '#8b5cf6';
      case 'Corruption': return '#ff9900';
      default: return 'var(--accent-primary)';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Signalements</h1>
          <p className="page-subtitle">Gérez et suivez l'évolution de tous vos signalements</p>
        </div>
        {/* Bouton pour afficher/masquer les filtres */}
        <button 
          className={`primary-action-btn header-action ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filtrer</span>
        </button>
      </div>

      {/* Panneau des filtres (conditionnel) */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Statut :</label>
            <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <div 
                className="dropdown-trigger" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{filterStatus === "Tous" ? "Tous les statuts" : filterStatus}</span>
                <ChevronRight size={18} className="dropdown-arrow" />
              </div>
              {/* Menu déroulant des statuts */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {statusOptions.map(option => (
                    <div 
                      key={option} 
                      className={`dropdown-item ${filterStatus === option ? 'selected' : ''}`}
                      onClick={() => {
                        setFilterStatus(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option === "Tous" ? "Tous les statuts" : option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Checkbox pour masquer les dossiers des collègues */}
          <div className="filter-group checkbox-group">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={hideOtherHR} 
                onChange={(e) => setHideOtherHR(e.target.checked)} 
              />
              <span className="checkbox-checkmark"></span>
              <span className="checkbox-text">Masquer les dossiers d'autres RH</span>
            </label>
          </div>
        </div>
      )}

      {/* Liste des signalements */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des signalements...</p>
        </div>
      ) : (
        <div className="signalements-grid">
          {filteredReports.length === 0 ? (
            <div className="empty-state">
              <p>Aucun signalement ne correspond à vos filtres</p>
            </div>
          ) : (
            filteredReports.map((item, index) => {
              const statusConfig = getStatusConfig(item.LibelleStatutSi);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={item.IdSignalement}
                  className={`signalement-bento-card ${
                    (item.LibelleStatutSi === "Pris en charge" || item.LibelleStatutSi === "Traitement en cours") && 
                    item.IdResponsable && item.IdResponsable !== user.IdUtil ? 'is-locked' : ''
                  }`}
                  onClick={() => {
                    const isTakenByOther = (item.LibelleStatutSi === "Pris en charge" || item.LibelleStatutSi === "Traitement en cours") && 
                                           item.IdResponsable && 
                                           item.IdResponsable !== user.IdUtil;

                    // Sécurité : on empêche d'ouvrir les dossiers des collègues
                    if (isTakenByOther) {
                      alert("Ce dossier est déjà pris en charge par un autre membre de l'équipe.");
                      return;
                    }
                    
                    onNavigate('details', item.IdSignalement)
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="card-top-accent" style={{ backgroundColor: getCategoryColor(item.Libelle) }}></div>
                  <div className="card-content">
                    <div className="card-header">
                      <span className={`status-badge ${statusConfig.className}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                      <span className="category-pill" style={{ color: getCategoryColor(item.Libelle), backgroundColor: `${getCategoryColor(item.Libelle)}15` }}>
                        {item.Libelle}
                      </span>
                    </div>

                    <h3 className="card-title">{item.Titre}</h3>
                    <p className="card-description">{item.Description}</p>

                    <div className="card-footer">
                      <div className="reporter-info">
                        <div className="reporter-avatar">U{item.IdUtil}</div>
                        <div className="reporter-details">
                          <span className="reporter-name">{item.info_utilisateur}</span>
                          <span className="report-date">{new Date(item.Date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="action-icon">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Signalements;