import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, AlertCircle, User, Calendar, Check, FileText, Download, Eye, X, Image as ImageIcon, Video, Music } from 'lucide-react';
import '../styles/SharedPages.css';
import '../styles/SignalementDetail.css';

// Page SignalementDetail : Affiche les détails d'un signalement, les documents joints et la messagerie
const SignalementDetail = ({ reportId, onBack, user }) => {
    // État pour les données du signalement
    const [report, setReport] = useState(null);
    // État de chargement initial
    const [loading, setLoading] = useState(true);
    // Liste des commentaires (messages)
    const [comments, setComments] = useState([]);
    // Nouveau commentaire en cours de rédaction
    const [newComment, setNewComment] = useState("");
    // Liste des documents attachés
    const [documents, setDocuments] = useState([]);
    // États pour la modale de prévisualisation de fichier
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewFileName, setPreviewFileName] = useState("");
    // Référence pour scroller automatiquement en bas de la discussion
    const commentaryDisplayRef = useRef(null);

    const scrollToBottom = () => {
        if (commentaryDisplayRef.current) {
            commentaryDisplayRef.current.scrollTo({
                top: commentaryDisplayRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments.length]);

    // Effet pour charger les données initiales et mettre en place une actualisation automatique
    useEffect(() => {
        const fetchData = () => {
            // 1. Récupère les détails du signalement
            fetch("http://localhost:8081/reports")
                .then(res => res.json())
                .then(data => {
                    const found = data.find(r => r.IdSignalement === reportId);
                    setReport(found);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur lors de la récupération du signalement:", err);
                    setLoading(false);
                });

            // 2. Récupère les commentaires associés
            fetch(`http://localhost:8081/reports/${reportId}/comments`)
                .then(res => res.json())
                .then(data => setComments(data))
                .catch(err => console.error("Erreur lors de la récupération des commentaires:", err));

            // 3. Récupère les documents liés
            fetch(`http://localhost:8081/reports/${reportId}/documents`)
                .then(res => res.json())
                .then(data => setDocuments(data))
                .catch(err => console.error("Erreur lors de la récupération des documents:", err));
        };

        // Premier appel au montage du composant
        fetchData();

        // On rafraîchit les messages et le statut toutes les 5 secondes (Polling)
        const intervalId = setInterval(fetchData, 5000);

        // Nettoyage de l'intervalle quand on quitte la page
        return () => clearInterval(intervalId);
    }, [reportId]);

    // Fonction pour qu'un RH "prenne en charge" un dossier
    const handlePrendreEnCharge = (IdSignalement) => {
        // Mise à jour immédiate côté interface pour plus de fluidité
        setReport(prev => ({ ...prev, LibelleStatutSi: "Pris en charge", IdResponsable: user.IdUtil }));

        // Envoi au serveur pour mise à jour en base de données
        fetch(`http://localhost:8081/reports/${IdSignalement}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ LibelleStatutSi: "Pris en charge", IdResponsable: user.IdUtil })
        })
            .catch(err => console.error(err));
    }

    // Marque le dossier comme "Résolu" (fermeture définitive)
    const handleResoudre = (IdSignalement) => {
        if (window.confirm("Êtes-vous sûr de vouloir marquer ce signalement comme résolu ?")) {
            setReport(prev => ({ ...prev, LibelleStatutSi: "Résolu", IdResponsable: user.IdUtil }));

            fetch(`http://localhost:8081/reports/${IdSignalement}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ LibelleStatutSi: "Résolu", IdResponsable: user.IdUtil })
            })
                .catch(err => console.error("Erreur lors de la résolution:", err));
        }
    };

    // Passe le dossier en mode "Traitement en cours"
    const handleTraitement = (IdSignalement) => {
        setReport(prev => ({ ...prev, LibelleStatutSi: "Traitement en cours", IdResponsable: user.IdUtil }));

        fetch(`http://localhost:8081/reports/${IdSignalement}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ LibelleStatutSi: "Traitement en cours", IdResponsable: user.IdUtil })
        })
            .catch(err => console.error("Erreur lors du passage en traitement:", err));
    };

    console.log(user);

    const handleSendMessage = () => {
        if (!newComment.trim() || report.LibelleStatutSi === "Résolu") return;

        const commentData = {
            Contenu: newComment,
            IdSignalement: reportId,
            IdUtil: user.IdUtil,
        };

        fetch("http://localhost:8081/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData)
        })
            .then(res => res.json())
            .then(data => {
                // Re-fetch comments or add to state locally
                fetch(`http://localhost:8081/reports/${reportId}/comments`)
                    .then(res => res.json())
                    .then(data => setComments(data));
                setNewComment("");
            })
            .catch(err => console.error(err));
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    // Demande au serveur une URL temporaire pour visualiser le fichier dans la modale
    const handleViewFile = (idDocument, fileName) => {
        fetch(`http://localhost:8081/documents/${idDocument}/url`)
            .then(res => res.json())
            .then(data => {
                if (data.url) {
                    setPreviewUrl(data.url);
                    setPreviewFileName(fileName);
                    setShowModal(true);
                }
            })
            .catch(err => console.error("Erreur lors de la visualisation:", err));
    };

    // Déclenche le téléchargement forcé d'un fichier via une URL signée dédiée au téléchargement
    const handleDownloadFile = (idDocument, fileName) => {
        fetch(`http://localhost:8081/documents/${idDocument}/url?download=true`)
            .then(res => res.json())
            .then(data => {
                if (data.url) {
                    const link = document.createElement('a');
                    link.href = data.url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })
            .catch(err => console.error("Erreur lors du téléchargement:", err));
    };


    if (loading) return <div className="page-container"><p>Chargement...</p></div>;
    if (!report) return <div className="page-container"><p>Signalement introuvable.</p><button onClick={onBack}>Retour</button></div>;

    // Barrière de sécurité : Si le dossier est pris par un autre
    const isTakenByOther = (report.LibelleStatutSi === "Pris en charge" || report.LibelleStatutSi === "Traitement en cours") && 
                            report.IdResponsable && 
                            report.IdResponsable !== user.IdUtil;

    if (isTakenByOther) {
        return (
            <div className="page-container flex-center">
                <div className="restricted-access-card">
                    <div className="lock-icon-large">🔒</div>
                    <h2>Accès Restreint</h2>
                    <p>Ce signalement est actuellement traité par un autre membre de l'équipe.</p>
                    <div className="restricted-info">
                        Responsable actuel : <strong>Utilisateur #{report.IdResponsable}</strong>
                    </div>
                    <button onClick={onBack} className="back-link">Retour aux signalements</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <button onClick={onBack} className="filter-btn back-button">
                    <ArrowLeft size={18} /> Retour à la liste
                </button>
                <h1 className="page-title">{report.Titre}</h1>
                <p className="page-subtitle">Détails complets du signalement #{report.IdSignalement}</p>
            </div>

            <div className="detail-container">
                <div className="signalement-card">
                    <div className="detail-content">

                        <div className="detail-section-header">
                            <span className="signalement-category">{report.Libelle}</span>
                            <span className={`detail-status-badge ${
                                report.LibelleStatutSi === 'Envoyé' ? 'status-sent' : 
                                report.LibelleStatutSi === 'Pris en charge' ? 'status-accepted' : 
                                report.LibelleStatutSi === 'Traitement en cours' ? 'status-processing' : 
                                report.LibelleStatutSi === 'Résolu' ? 'status-resolved' : ''
                            }`}>
                                {report.LibelleStatutSi}
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
                                <span>Utilisateur : <span className='user-info'>{report.info_utilisateur}</span></span>
                            </div>
                            <div className="detail-meta-item">
                                <Calendar size={18} />
                                <span>Date: {new Date(report.Date).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        <div className="documents-section">
                            <h3 className="detail-section-title">
                                <FileText size={20} /> Documents
                            </h3>
                            <div className="documents-list">
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <div key={doc.IdDocument} className="document-item">
                                            <div className="document-info">
                                                <div className="document-icon">
                                                    {doc.NomFichier.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp)$/) ? <ImageIcon size={16} /> :
                                                     doc.NomFichier.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? <Video size={16} /> :
                                                     doc.NomFichier.toLowerCase().match(/\.(mp3|wav|ogg|flac)$/) ? <Music size={16} /> :
                                                     <FileText size={16} />}
                                                </div>
                                                <span className="document-name" title={doc.NomFichier}>{doc.NomFichier}</span>
                                            </div>
                                            <div className="document-actions">
                                                <button
                                                    className="doc-action-btn view-btn"
                                                    title="Visualiser"
                                                    onClick={() => handleViewFile(doc.IdDocument, doc.NomFichier)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="doc-action-btn download-btn"
                                                    title="Télécharger"
                                                    onClick={() => handleDownloadFile(doc.IdDocument, doc.NomFichier)}
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-documents">Aucun document joint à ce signalement.</p>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="signalement-actions">
                        {report.LibelleStatutSi === "Envoyé" && (
                            <button className="accept-btn" onClick={() => handlePrendreEnCharge(report.IdSignalement)}>
                                <Check size={18} /> Prendre en charge
                            </button>
                        )}
                        {(report.LibelleStatutSi === "Pris en charge" || report.LibelleStatutSi === "Traitement en cours") && (
                            <div className="resolve-action-container">
                                <p className="status-text" style={{ textAlign: "center", marginBottom: "0" }}>
                                    Signalement {report.LibelleStatutSi === "Pris en charge" ? "pris en charge." : "en cours de traitement."}
                                </p>
                                {report.LibelleStatutSi === "Pris en charge" && (
                                    <button className="processing-btn" onClick={() => handleTraitement(report.IdSignalement)}>
                                        <AlertCircle size={18} /> Traitement en cours
                                    </button>
                                )}
                                <button className="resolve-btn" onClick={() => handleResoudre(report.IdSignalement)}>
                                    <Check size={18} /> Marquer comme résolu
                                </button>
                            </div>
                        )}
                        {report.LibelleStatutSi === "Résolu" && (
                            <p className="status-text" style={{ color: "var(--success)" }}>
                                Ce signalement a été résolu.
                            </p>
                        )}
                    </div>
                </div>

                <div className="commentary-section">
                    <div className="commentary-header">Messages</div>
                    <div className="commentary-display" ref={commentaryDisplayRef}>
                        {comments.map((comment) => {
                            const isOwn = comment.IdUtil === user.IdUtil;
                            return (
                                <div
                                    key={comment.IdCommentaire}
                                    className={`commentary-bubble ${isOwn ? 'own-message' : 'other-message'}`}
                                >
                                    <div className="bubble-header">
                                        <span className="user-name">{comment.Prenom} {comment.Nom}</span>
                                        <span className="commentary-date">
                                            {new Date(comment.DateCommentaire).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="commentary-content">{comment.Contenu}</p>
                                </div>
                            );
                        })}
                        {comments.length === 0 && <p className="no-comments">Aucun message pour le moment.</p>}
                    </div>
                    <div className="commentary-input">
                        {report.LibelleStatutSi === "Résolu" ? (
                            <div className="disabled-comment-message" style={{ color: "var(--success, #10b981)", fontSize: "14px", textAlign: "center", width: "100%", padding: "10px", fontWeight: "600" }}>
                                Ce signalement est résolu. La conversation est fermée.
                            </div>
                        ) : (report.LibelleStatutSi !== "Pris en charge" && report.LibelleStatutSi !== "Traitement en cours") ? (
                            <div className="disabled-comment-message" style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", width: "100%", padding: "10px" }}>
                                Vous devez prendre en charge ce signalement pour envoyer des messages.
                            </div>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Votre message"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button className="send-message-btn" onClick={handleSendMessage}>Envoyer Message</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* File Viewer Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                {previewFileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp)$/) ? <ImageIcon size={20} /> :
                                 previewFileName.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? <Video size={20} /> :
                                 previewFileName.toLowerCase().match(/\.(mp3|wav|ogg|flac)$/) ? <Music size={20} /> :
                                 <FileText size={20} />}
                                <span>{previewFileName}</span>
                            </div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {previewFileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp)$/) ? (
                                <img src={previewUrl} alt={previewFileName} className="preview-image" />
                            ) : previewFileName.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? (
                                <video src={previewUrl} controls className="preview-video">
                                    Votre navigateur ne supporte pas la lecture de vidéos.
                                </video>
                            ) : previewFileName.toLowerCase().match(/\.(mp3|wav|ogg|flac)$/) ? (
                                <div className="audio-preview-container">
                                    <Music size={64} className="audio-icon" />
                                    <audio src={previewUrl} controls className="preview-audio">
                                        Votre navigateur ne supporte pas la lecture audio.
                                    </audio>
                                </div>
                            ) : (
                                <iframe
                                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                                    title={previewFileName}
                                    className="preview-iframe"
                                    frameBorder="0"
                                ></iframe>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="modal-btn-download" onClick={() => handleDownloadFile(documents.find(d => d.NomFichier === previewFileName)?.IdDocument, previewFileName)}>
                                <Download size={18} /> Télécharger
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignalementDetail;
