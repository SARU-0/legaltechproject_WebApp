const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json()); // ← important pour parser le JSON

const db = mysql.createConnection({
    host:"localhost",
    user: 'root',
    password: '',
    database:'legaltechtest',
})

app.get('/', (re,res)=> {
    return res.json("From Backend Side");
})

app.get('/reports', (req, res)=>{
    const sql = "SELECT * FROM signalement";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.put('/reports/:idSignalement', (req, res) => {
    const idSignalement = req.params.idSignalement;
    const {StatutSi} = req.body;

    const sql = "UPDATE signalement SET StatutSi = ? WHERE idSignalement = ?";

    db.query(sql, [StatutSi, idSignalement], (err, result)=> {
        if (err) return res.status(500).json(err);
        res.json({message : "Statut mis à jour avec succès"})
    })
})

/*
app.post('/users', (req, res) => {
    const { nom, email } = req.body;
    const sql = "INSERT INTO utilisateurs (nom, email) VALUES (?, ?)";

    db.query(sql, [nom, email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erreur lors de l'insertion" });
        }
        return res.json({ message: "Utilisateur ajouté", result });
    });
});
*/
app.listen(8081, ()=> {
    console.log("listening")
})