const mysql = require('mysql');

// Script utilitaire pour vérifier la connexion à la base de données et l'accès aux tables
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'legaltechtest',
});

// Tente de se connecter au serveur MySQL
db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion :", err.message);
        process.exit(1);
    }
    console.log("Connecté à MySQL avec succès");
    
    // Vérifie quelles tables sont présentes dans la base
    db.query("SHOW TABLES", (err, tables) => {
        if (err) {
            console.error("Erreur lors de SHOW TABLES :", err.message);
            db.end();
            return;
        }
        console.log("Tables disponibles :", tables);
        
        // Teste la lecture sur la vue des signalements pour vérifier si elle fonctionne
        db.query("SELECT * FROM vue_signalement LIMIT 1", (err, data) => {
            if (err) {
                console.error("Erreur lors de la lecture de vue_signalement :", err.message);
            } else {
                console.log("Données récupérées de vue_signalement (test) :", data);
            }
            db.end(); // Ferme la connexion après les tests
        });
    });
});

