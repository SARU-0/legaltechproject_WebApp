import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
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

    const sentReports = reports.filter(report => report.StatutSi === 'Envoyé').length;
    const acceptedReports = reports.filter(report => report.StatutSi === 'Pris en charge').length;

    const data = [
        { name: "Envoyé", value: sentReports },
        { name: "Pris en charge", value: acceptedReports },
    ];

    const COLORS = ["#f59e0b", "#3b82f6"];


    return (
        <div className="page-container">
            <div className="recap-container">
                <h1>Progression des signalements</h1>
                <div className="data-container">
                    <div className="chart-container" style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Utilisateur</th>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Catégorie</th>
                        <th>Date</th>
                        <th>Statut</th>
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
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Dashboard;
