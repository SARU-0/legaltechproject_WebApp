const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json()); // ← important pour parser le JSON

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'legaltechtest',
})

app.get('/', (re, res) => {
    return res.json("From Backend Side");
})

app.get('/reports', (req, res) => {
    const sql = `SELECT s.*, cs.Libelle, ss.LibelleStatutSi FROM signalement s
                INNER JOIN categoriesignalement cs ON s.IdCatSi = cs.IdCatSi
                INNER JOIN statutsignalement ss ON s.IdStatutSi = ss.IdStatutSi `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.put('/reports/:IdSignalement', (req, res) => {
    const IdSignalement = req.params.IdSignalement;
    const { LibelleStatutSi } = req.body;

    const sql = `UPDATE signalement 
                SET IdStatutSi = (SELECT IdStatutSi FROM statutsignalement WHERE LibelleStatutSi = ?)
                WHERE IdSignalement = ?`;

    db.query(sql, [LibelleStatutSi, IdSignalement], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Statut mis à jour avec succès" })
    })
})


// Login simple sans hash
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = `
        SELECT u.*, s.LibelleStatutUtil 
        FROM Utilisateurs u 
        INNER JOIN StatutUtilisateur s ON u.IdStatutUtil = s.IdStatutUtil 
        WHERE u.Email = ? AND u.Hash_password = ?
    `;
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const user = results[0];

        // On renvoie uniquement les infos nécessaires, pas le mot de passe
        res.json({
            idUtilisateur: user.idUtil,
            nom: user.Nom,
            prenom: user.Prenom,
            email: user.Email,
            statut: user.LibelleStatutUtil
        });
    });
});

/*
app.post('/users', (req, res) => {
    const { nom, email } = req.body;
    const sql = "INSERT INTO utilisateurs (nom, email) VALUES (?, ?)";

    db.query(sql, [nom, email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erreur lors de l'insertion" });
        }
        return res.json({ message : "Utilisateur ajouté", result });
    });
});
*/
app.listen(8081, () => {
    console.log("listening")
})