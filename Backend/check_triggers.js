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

async function checkTriggers() {
    try {
        const [triggers] = await db.promise().query("SHOW TRIGGERS");
        console.log("Database Triggers:", JSON.stringify(triggers, null, 2));

        // Check if any trigger refers to 'salt'
        const problematicTriggers = triggers.filter(t => t.Statement.includes('salt'));
        console.log("Found problematic triggers:", problematicTriggers.map(t => t.Trigger));

    } catch (err) {
        console.error("Trigger Check Error:", err.message);
    } finally {
        process.exit(0);
    }
}

checkTriggers();
