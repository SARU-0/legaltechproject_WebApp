import React, {useEffect, useState} from 'react';
import '../styles/SharedPages.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
    /*Ici, on crée une variable/constante qui permettra de stocker les données récupérées via la requête côté backend.
    La méthode setReports permet de modifier la valeur de cette constante.*/
    const [reports, setReports] = useState([]);

    /*useEffect est une méthode qui permet de récupérer des informations renvoyées par l'API backend,
    ici les données de la BDD via la requête. fetch() permet d'envoyer une requête (demande de données)
    vers le lien défini en backend. Dans la ligne d'après, on récupère le json et le converti en objet JavaScript,
    ensuite, on stocke ces données dans notre variable. S'il y a une erreur, elle s'affichera dans la console.
     */
    useEffect(() => {
        fetch("http://localhost:8081/reports")
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => console.error(err));
    }, []);

    const handlePrendreEnCharge = (idSignalement) => {
        // Mise à jour locale immédiate
        setReports(prevReports =>
            prevReports.map(r =>
                r.idSignalement === idSignalement
                    ? { ...r, StatutSi: "Pris en charge" } // <-- ici on utilise StatutSi
                    : r
            )
        );
        // Mise à jour côté backend
        fetch(`http://localhost:8081/reports/${idSignalement}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ StatutSi: "Pris en charge" }) // <-- backend reçoit StatutSi
        });
    }

    return (
    <div className="page-container">
        <table>
            <thead>
            <tr>
                <th>Utilisateur</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {/*Chaque ligne de notre tableau est rempli grâce aux données récupérées et la méthode .map().
            Ensuite pour chaque signalement, identifié grâce à leur id, on remplit les colonnes avec les informations
            propres à chaque signalement. Attention!! Le nom des attributs est important, ils doivent être identiques à ceux
            dans la BDD.*/}

            {reports.map((item) => (
                <tr key={item.idSignalement}>
                    <td>{item.idUtil}</td>
                    <td>{item.Titre}</td>
                    <td>{item.Description}</td>
                    <td>{item.Categorie}</td>
                    {/*Formatage de la date pour un meilleur affichage*/}
                    <td>{new Date(item.Date).toLocaleDateString()}</td>
                    <td>{item.StatutSi}</td>
                    <td>
                        {item.StatutSi === "Envoyé" && (
                            <button onClick={() => handlePrendreEnCharge(item.idSignalement)}>
                                Prendre en charge
                            </button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>

        </table>
    </div>
  );
};

export default Dashboard;
