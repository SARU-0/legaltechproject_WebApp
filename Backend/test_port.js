const express = require('express');
const app = express();

// Serveur de test minimal pour vérifier si le port 8081 est libre et accessible
app.get('/', (req, res) => res.json("Le port 8081 répond correctement"));

// Écoute sur le port 8081
app.listen(8081, () => console.log("Serveur de test en cours d'exécution sur le port 8081"));

