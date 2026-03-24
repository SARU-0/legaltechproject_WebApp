// Importation des modules nécessaires
const express = require('express'); // Framework web pour Node.js
const mysql = require('mysql2'); // Pilote pour se connecter à MySQL
const cors = require('cors'); // Middleware pour autoriser les requêtes cross-origin
const Minio = require('minio'); // Client pour interagir avec le stockage d'objets MinIO
const crypto = require('crypto'); // Pour le décryptage des données

const AES_KEY = 'ApZoEiRuTyQmSlDk'; // Clé pour les descriptions
const AES_KEY_FILES = 'WnXbCvQmSlDkFjGh'; // Clé pour les fichiers

const app = express();
app.use(cors()); // Active le support CORS (nécessaire pour les appels depuis le frontend)
app.use(express.json()); // Middleware pour analyser le corps des requêtes en JSON

// Configuration de la connexion à la base de données MySQL
const db = mysql.createPool({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'legaltechtest',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

const BUCKET_NAME = 'signalements-docs';

// Initialisation de MinIO : On s'assure que le bucket existe
minioClient.bucketExists(BUCKET_NAME, (err, exists) => {
    if (err) {
        console.error("Erreur l'initialisation de MinIO:", err.message);
        return;
    }
    if (!exists) {
        minioClient.makeBucket(BUCKET_NAME, 'us-east-1', (err) => {
            if (err) return console.error("Erreur création bucket MinIO:", err.message);
            console.log(`Bucket MinIO '${BUCKET_NAME}' créé.`);
        });
    } else {
        console.log(`Bucket MinIO '${BUCKET_NAME}' prêt.`);
    }
});

// Fonction générique de décryptage AES-128-ECB
function aesDecrypt(encryptedBase64, keyStr) {
    if (!encryptedBase64) return "";
    try {
        const key = Buffer.from(keyStr, 'utf8');
        const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
        decipher.setAutoPadding(true);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encryptedBase64, 'base64')),
            decipher.final()
        ]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Erreur de décryptage AES :", error.message);
        return encryptedBase64;
    }
}

// Spécialisation pour les descriptions
function decrypt(encryptedText) {
    return aesDecrypt(encryptedText, AES_KEY);
}

// Spécialisation pour les noms de fichiers
function decryptFile(encryptedText) {
    return aesDecrypt(encryptedText, AES_KEY_FILES);
}

// --- Routes de l'API ---

// Route de test pour vérifier que le backend est en ligne
app.get('/', (req, res) => {
    res.json("Backend LegalTech is running");
});

// Récupère la liste de tous les signalements (via une vue SQL spécifique)
app.get('/reports', (req, res) => {
    const sql = "SELECT * FROM vue_signalement";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        // Décryptage de la description pour chaque signalement
        const decryptedData = data.map(r => ({
            ...r,
            Description: decrypt(r.Description)
        }));

        res.json(decryptedData);
    });
});

// Récupère le nombre total de signalements
app.get('/reports/count', (req, res) => {
    const sql = "SELECT COUNT(*) as nb_signalement FROM vue_signalement";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(data);
    });
});

// Met à jour le statut d'un signalement et lui assigne un responsable
app.put('/reports/:IdSignalement', (req, res) => {
    const IdSignalement = req.params.IdSignalement;
    const { LibelleStatutSi, IdResponsable } = req.body;
    const sql = `
        SET @current_user_id = ?;
        UPDATE signalement 
        SET IdStatutSi = (SELECT IdStatutSi FROM statutsignalement WHERE LibelleStatutSi = ?),
            IdResponsable = ?
        WHERE IdSignalement = ?
    `;
    db.query(sql, [IdResponsable, LibelleStatutSi, IdResponsable, IdSignalement], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Statut mis à jour avec succès" });
    });
});

// Gère la connexion des utilisateurs
app.post("/login", (req, res) => {
    const { email, hashedPassword } = req.body; // hashedPassword est haché une fois par le frontend
    console.log(`Tentative de connexion pour : ${email}`);

    // Étape 1 : Récupérer les infos de l'utilisateur (dont le salt)
    const sql = `
        SELECT u.*, s.LibelleStatutUtil 
        FROM utilisateurs u 
        INNER JOIN statututilisateur s ON u.IdStatutUtil = s.IdStatutUtil 
        WHERE u.Email = ?
    `;

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Erreur SQL lors du login :", err.message);
            return res.status(500).json({ message: "Erreur serveur", error: err.message });
        }

        if (results.length === 0) {
            console.warn(`Échec de connexion (Utilisateur non trouvé) : ${email}`);
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const user = results[0];
        const storedHash = user.Hash_password;
        const salt = user.salt;

        let finalComparison = false;

        // Étape 2 : Comparaison avec sel (Logique spécifique demandée : hacher les deux côtés avec le sel)
        if (user.isFirstLog || !salt) {
            // Si c'est la 1ère connexion ou s'il n'y a pas encore de sel (ancien compte)
            finalComparison = (hashedPassword === storedHash);
        } else {
            // On hache (hash_bdd + salt) et on compare avec (hash_frontend + salt) haché
            const val1 = crypto.createHash('sha256').update(storedHash + salt).digest('hex');
            const val2 = crypto.createHash('sha256').update(hashedPassword + salt).digest('hex');
            finalComparison = (val1 === val2);
        }

        if (!finalComparison) {
            console.warn(`Échec de connexion (Mot de passe incorrect) : ${email}`);
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        console.log(`Connexion réussie : ${user.Pseudo}`);
        res.json({
            IdUtil: user.IdUtil,
            nom: user.Nom,
            prenom: user.Prenom,
            pseudo: user.Pseudo,
            email: user.Email,
            statut: user.LibelleStatutUtil,
            isFirstLog: user.isFirstLog
        });
    });
});

// Récupère les commentaires liés à un signalement spécifique
app.get('/reports/:IdSignalement/comments', (req, res) => {
    const IdSignalement = req.params.IdSignalement;
    const sql = `
        SELECT c.*, u.Nom, u.Prenom 
        FROM commentaires c
        INNER JOIN utilisateurs u ON c.IdUtil = u.IdUtil
        WHERE c.IdSignalement = ?
        ORDER BY c.DateCommentaire ASC
    `;
    db.query(sql, [IdSignalement], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(data);
    });
});

// Ajoute un nouveau commentaire à un signalement
app.post('/comments', (req, res) => {
    const { Contenu, IdSignalement, IdUtil } = req.body;
    const sql = `
        SET @current_user_id = ?;
        INSERT INTO commentaires (Contenu, IdSignalement, IdUtil) VALUES (?, ?, ?)
    `;
    db.query(sql, [IdUtil, Contenu, IdSignalement, IdUtil], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Commentaire ajouté", id: result[1].insertId });
    });
});

// Finalise la configuration du compte lors de la première connexion (pseudo, mot de passe, sel)
app.put('/finish-onboarding', (req, res) => {
    const { IdUtil, pseudo, newPassword, salt } = req.body;
    const sql = "UPDATE utilisateurs SET Pseudo = ?, Hash_password = ?, salt = ?, isFirstLog = 0 WHERE IdUtil = ?";
    db.query(sql, [pseudo, newPassword, salt, IdUtil], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
        res.json({ message: "Profil configuré avec succès" });
    });
});

// Enregistre un nouvel utilisateur (utilisé par l'admin)
app.post('/signUp', (req, res) => {
    const { nom, prenom, email, password } = req.body;
    const checkSql = "SELECT * FROM utilisateurs WHERE Email = ?";
    db.query(checkSql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (results.length > 0) return res.status(409).json({ error: "Email déjà utilisé" });

        const roleId = req.body.IdStatutUtil || 1;
        const tempPseudo = "En attente"; // Valeur par défaut avant l'onboarding
        const insertSql = "INSERT INTO utilisateurs (Nom, Prenom, Email, Hash_password, IdStatutUtil, Pseudo, salt) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(insertSql, [nom, prenom, email, password, roleId, tempPseudo, ""], (err, result) => {
            if (err) {
                console.error("Erreur lors de l'inscription :", err.message);
                return res.status(500).json({ error: "Erreur lors de l'inscription", detail: err.message });
            }
            res.status(201).json({ message: "Inscription réussie", id: result.insertId });
        });
    });
});

// Récupère les documents joints à un signalement (avec décryptage des noms)
app.get('/reports/:IdSignalement/documents', (req, res) => {
    const IdSignalement = req.params.IdSignalement;
    const sql = "SELECT * FROM documentssignalement WHERE IdSignalement = ?";
    db.query(sql, [IdSignalement], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Décryptage du nom du fichier pour chaque document
        const decryptedDocuments = data.map(doc => ({
            ...doc,
            NomFichier: decryptFile(doc.NomFichier)
        }));

        res.json(decryptedDocuments);
    });
});

// Génère une URL temporaire sécurisée pour consulter un document sur MinIO
app.get('/documents/:IdDocument/url', (req, res) => {
    const IdDocument = req.params.IdDocument;
    const sql = "SELECT LienMinIO FROM documentssignalement WHERE IdDocument = ?";

    db.query(sql, [IdDocument], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: "Document inexistant" });

        // Décryptage du lien MinIO (le chemin du fichier peut être crypté en base)
        let objectName = decryptFile(results[0].LienMinIO);

        // Si le chemin commence par le nom du bucket suivi d'un slash, on le retire car MinIO le gère déjà via l'argument BUCKET_NAME
        const bucketPrefix = `${BUCKET_NAME}/`;
        if (objectName.startsWith(bucketPrefix)) {
            objectName = objectName.substring(bucketPrefix.length);
        }

        const extension = objectName.split('.').pop().toLowerCase();

        // Mappe les extensions de fichiers vers les types MIME correspondants
        const mimeTypes = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg'
        };

        const contentType = mimeTypes[extension] || 'application/octet-stream';
        const isDownload = req.query.download === 'true';
        const disposition = isDownload ? `attachment; filename="${objectName.split('/').pop()}"` : 'inline';

        const respHeaders = {
            'response-content-disposition': disposition,
            'response-content-type': contentType
        };

        // Demande une URL présignée au serveur MinIO avec une validité de 1 heure
        minioClient.presignedGetObject(BUCKET_NAME, objectName, 3600, respHeaders, (err, presignedUrl) => {
            if (err) return res.status(500).json({ error: "Erreur MinIO" });
            res.json({ url: presignedUrl });
        });
    });
});

// Lancement du serveur d'écoute
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});