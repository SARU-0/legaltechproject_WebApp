import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import '../Pages.css';

const Signalements = () => {
  const [filter, setFilter] = useState('all');

  const signalements = [
    { id: 1, title: 'Problème de paiement', status: 'pending', priority: 'high', date: '2025-01-10', user: 'Marie Durand' },
    { id: 2, title: 'Bug sur la page produit', status: 'in-progress', priority: 'medium', date: '2025-01-09', user: 'Pierre Martin' },
    { id: 3, title: 'Demande de remboursement', status: 'resolved', priority: 'low', date: '2025-01-08', user: 'Sophie Bernard' },
    { id: 4, title: 'Erreur 404 non résolue', status: 'pending', priority: 'high', date: '2025-01-08', user: 'Luc Petit' },
    { id: 5, title: 'Performance lente', status: 'in-progress', priority: 'medium', date: '2025-01-07', user: 'Anne Dubois' },
    { id: 6, title: 'Suggestion d\'amélioration', status: 'resolved', priority: 'low', date: '2025-01-06', user: 'Thomas Roux' },
    { id: 7, title: 'Problème de connexion', status: 'pending', priority: 'high', date: '2025-01-06', user: 'Julie Moreau' },
    { id: 8, title: 'Question sur les frais', status: 'resolved', priority: 'low', date: '2025-01-05', user: 'Marc Simon' },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: '#f59e0b', icon: Clock };
      case 'in-progress':
        return { label: 'En cours', color: '#667eea', icon: AlertCircle };
      case 'resolved':
        return { label: 'Résolu', color: '#10b981', icon: CheckCircle };
      default:
        return { label: 'Inconnu', color: '#6b7280', icon: XCircle };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredSignalements = filter === 'all' 
    ? signalements 
    : signalements.filter(s => s.status === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Signalements</h1>
          <p className="page-subtitle">Gérez tous vos signalements ici</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="filter-bar">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <Filter size={16} />
            Tous ({signalements.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            En attente ({signalements.filter(s => s.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            En cours ({signalements.filter(s => s.status === 'in-progress').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Résolus ({signalements.filter(s => s.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="signalements-list">
        {filteredSignalements.map((signalement, index) => {
          const statusConfig = getStatusConfig(signalement.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div 
              key={signalement.id} 
              className="signalement-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="signalement-header">
                <div className="signalement-priority" style={{ backgroundColor: getPriorityColor(signalement.priority) }}>
                </div>
                <h3 className="signalement-title">{signalement.title}</h3>
                <div 
                  className="signalement-status"
                  style={{ 
                    backgroundColor: `${statusConfig.color}15`,
                    color: statusConfig.color
                  }}
                >
                  <StatusIcon size={14} />
                  {statusConfig.label}
                </div>
              </div>
              <div className="signalement-footer">
                <span className="signalement-user">👤 {signalement.user}</span>
                <span className="signalement-date">📅 {signalement.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Signalements;
