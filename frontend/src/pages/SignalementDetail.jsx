import { useEffect, useState } from 'react';
import { ArrowLeft, AlertCircle, User, Calendar, Check, FileText } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/SignalementDetail.css';

const SignalementDetail = ({ reportId, onBack }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dans un vrai projet, on ferait fetch(`http://localhost:8081/reports/${reportId}`)
        fetch("http://localhost:8081/reports")
            .then(res => res.json())
            .then(data => {
                const found = data.find(r => r.idSignalement === reportId);
                setReport(found);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [reportId]);

    const handlePrendreEnCharge = (idSignalement) => {
        // Mise à jour locale immédiate de l'état (Optimistic UI)
        setReport(prev => ({ ...prev, StatutSi: "Pris en charge" }));

        // Mise à jour côté backend
        fetch(`http://localhost:8081/reports/${idSignalement}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ StatutSi: "Pris en charge" })
        })
            .catch(err => {
                console.error(err);
                // Optionnel : remettre l'ancien statut si erreur
                // setReport(prev => ({ ...prev, StatutSi: "Envoyé" }));
            });
    }


    if (loading) return <div className="page-container"><p>Chargement...</p></div>;
    if (!report) return <div className="page-container"><p>Signalement introuvable.</p><button onClick={onBack}>Retour</button></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <button onClick={onBack} className="filter-btn back-button">
                    <ArrowLeft size={18} /> Retour à la liste
                </button>
                <h1 className="page-title">{report.Titre}</h1>
                <p className="page-subtitle">Détails complets du signalement #{report.idSignalement}</p>
            </div>

            <div className="detail-container">
                <div className="signalement-card">
                    <div className="detail-content">

                        <div className="detail-section-header">
                            <span className="signalement-category">{report.Categorie}</span>
                            <span className="detail-status-badge">
                                {report.StatutSi}
                            </span>
                        </div>

                        <div>
                            <h3 className="detail-section-title">
                                <FileText size={20} /> Description
                            </h3>
                            <p className="detail-description">
                                {report.Description}
                            </p>
                        </div>

                        <div className="detail-meta-grid">
                            <div className="detail-meta-item">
                                <User size={18} />
                                <span>Utilisateur ID: {report.idUtil}</span>
                            </div>
                            <div className="detail-meta-item">
                                <Calendar size={18} />
                                <span>Date: {new Date(report.Date).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="signalement-actions">
                    {report.StatutSi === "Envoyé" && (
                        <button className="accept-btn" onClick={() => handlePrendreEnCharge(report.idSignalement)}>
                            <Check size={18} /> Prendre en charge
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignalementDetail;
