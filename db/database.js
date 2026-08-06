const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS productos(
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        comprado INTEGER DEFAULT 0
    )
`)
.then(() => console.log("Base de datos preparada"))
.catch(err => console.error(err));

module.exports = pool;