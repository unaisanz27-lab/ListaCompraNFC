const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");


db.serialize(()=>{

    db.run(`
        CREATE TABLE IF NOT EXISTS productos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            comprado INTEGER DEFAULT 0
        )
    `);

});


module.exports = db;