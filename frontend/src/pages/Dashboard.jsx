import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import '../styles/SharedPages.css';
import '../styles/Dashboard.css';

// Page Dashboard : Affiche une vue d'ensemble des statistiques et les derniers signalements
const Dashboard = ({ user, onNavigate }) => {
    // État pour stocker la liste des signalements
    const [reports, setReports] = useState([]);
    // État de chargement
    const [isLoading, setIsLoading] = useState(true);

    // Récupération des données depuis l'API au chargement du composant
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

    // Calcul des statistiques pour les compteurs et le graphique
    const sentReports = reports.filter(report => report.LibelleStatutSi === 'Envoyé').length;
    const acceptedReports = reports.filter(report => report.LibelleStatutSi === 'Pris en charge').length;
    const inProgressReports = reports.filter(report => report.LibelleStatutSi === 'Traitement en cours').length;
    const resolvedReports = reports.filter(report => report.LibelleStatutSi === 'Résolu').length;
    const totalReports = reports.length;

    // Données formatées pour le graphique en camembert (PieChart)
    const data = [
        { name: "Envoyé", value: sentReports },
        { name: "Pris", value: acceptedReports },
        { name: "En cours", value: inProgressReports },
        { name: "Résolu", value: resolvedReports }
    ];

    // Couleurs correspondantes aux statuts
    const COLORS = [
        "rgb(125, 125, 125)", // Envoyé
        "rgb(34, 139, 34)",   // Pris en charge
        "rgb(30, 100, 220)",  // Traitement en cours
        "rgb(0, 180, 160)"    // Résolu
    ];

    // Petite fonction utilitaire pour colorer les badges selon la catégorie du signalement
    const getCategoryColor = (categorie) => {
        switch (categorie) {
            case 'Harcèlement': return '#ff0000';
            case 'Discrimination': return '#002aff';
            case "Conflits d'intérêts": return '#8b5cf6';
            case 'Corruption': return '#ff9900';
            default: return '#3b82f6';
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Suivez l'activité de vos signalements en temps réel</p>
                </div>
            </header>

            {/* Affichage d'un spinner pendant que les données chargent */}
            {isLoading ? (
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Chargement des données...</p>
                </div>
            ) : (
                <>
                    {/* Grille de cartes de statistiques hautes (Total, Nouveaux, En cours, etc.) */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-info">
                                <span className="stat-label">Total Signalements</span>
                                <span className="stat-value">{totalReports}</span>
                            </div>
                            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-info">
                                <span className="stat-label">Nouveaux (Envoyé)</span>
                                <span className="stat-value" style={{ color: 'var(--status-sent)' }}>{sentReports}</span>
                            </div>
                            <div className="stat-icon" style={{ background: 'rgba(125, 125, 125, 0.1)', color: 'var(--status-sent)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-info">
                                <span className="stat-label">Pris en charge</span>
                                <span className="stat-value" style={{ color: 'var(--status-accepted)' }}>{acceptedReports}</span>
                            </div>
                            <div className="stat-icon" style={{ background: 'rgba(34, 139, 34, 0.1)', color: 'var(--status-accepted)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-info">
                                <span className="stat-label">En cours</span>
                                <span className="stat-value" style={{ color: 'var(--status-processing)' }}>{inProgressReports}</span>
                            </div>
                            <div className="stat-icon" style={{ background: 'rgba(30, 100, 220, 0.1)', color: 'var(--status-processing)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-info">
                                <span className="stat-label">Résolu</span>
                                <span className="stat-value" style={{ color: 'var(--status-resolved)' }}>{resolvedReports}</span>
                            </div>
                            <div className="stat-icon" style={{ background: 'rgba(0, 180, 160, 0.1)', color: 'var(--status-resolved)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-content-grid">
                        {/* Bloc Graphique */}
                        <div className="bento-box chart-box">
                            <h2 className="box-title">Progression des statuts</h2>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                                            itemStyle={{ color: 'var(--text-main)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bloc Tableau : Derniers signalements */}
                        <div className="bento-box table-box">
                            <div className="box-header">
                                <h2 className="box-title">Derniers Signalements</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Catégorie</th>
                                            <th>Date</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((item) => {
                                            // Sécurité : Vérifie si le dossier est déjà "verrouillé" par un collègue
                                            const isTakenByOther = (item.LibelleStatutSi === "Pris en charge" || item.LibelleStatutSi === "Traitement en cours") && 
                                                                    item.IdResponsable && 
                                                                    item.IdResponsable !== user.IdUtil;

                                            return (
                                                <tr 
                                                    key={item.IdSignalement}
                                                    onClick={() => {
                                                        if (isTakenByOther) {
                                                            alert("Ce dossier est déjà pris en charge par un autre membre de l'équipe.");
                                                            return;
                                                        }
                                                        // Navigation vers le détail du signalement
                                                        onNavigate('details', item.IdSignalement);
                                                    }}
                                                    className={isTakenByOther ? 'row-locked' : 'row-clickable'}
                                                >
                                                    <td className="font-medium text-main">{item.Titre}</td>
                                                    <td>
                                                        <span 
                                                            className="badge category-badge" 
                                                            style={{ 
                                                                color: getCategoryColor(item.Libelle), 
                                                                backgroundColor: `${getCategoryColor(item.Libelle)}15`,
                                                                border: 'none'
                                                            }}
                                                        >
                                                            {item.Libelle}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(item.Date).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`badge status-${item.LibelleStatutSi === 'Envoyé' ? 'pending' : item.LibelleStatutSi === 'Traitement en cours' ? 'processing' : item.LibelleStatutSi === 'Résolu' ? 'resolved' : 'active'}`}>
                                                            {item.LibelleStatutSi}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;

