const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'legaltechtest',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
});

async function check() {
    try {
        const [saltResults] = await db.promise().query("DESCRIBE salt");
        console.log("salt table structure:", saltResults);

        const [userResults] = await db.promise().query("DESCRIBE utilisateurs");
        const saltIdCol = userResults.find(c => c.Field === 'salt_id');
        console.log("utilisateurs salt_id column:", saltIdCol);
        
        const [oldSaltCol] = await db.promise().query("SHOW COLUMNS FROM utilisateurs LIKE 'salt'");
        console.log("utilisateurs old salt column:", oldSaltCol);

    } catch (err) {
        console.error("Database Check Error:", err.message);
    } finally {
        process.exit(0);
    }
}

check();
