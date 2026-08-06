const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const db = require("./db/database");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Obtener productos
app.get("/productos", async (req, res) => {

    try {

        const resultado = await db.query(
            "SELECT * FROM productos ORDER BY id ASC"
        );

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);
        res.sendStatus(500);

    }

});



// Añadir producto
app.post("/productos", async (req, res) => {

    const nombre = req.body.nombre;

    try {

        const resultado = await db.query(

            "INSERT INTO productos(nombre, comprado) VALUES($1,0) RETURNING *",

            [nombre]

        );

        const producto = resultado.rows[0];

        io.emit("producto añadido", producto);

        res.json(producto);

    } catch (error) {

        console.log(error);
        res.sendStatus(500);

    }

});



// Eliminar
app.delete("/productos/:id", async (req, res) => {

    const id = req.params.id;

    try {

        await db.query(
            "DELETE FROM productos WHERE id=$1",
            [id]
        );

        io.emit("producto eliminado", id);

        res.sendStatus(200);

    } catch (error) {

        console.log(error);
        res.sendStatus(500);

    }

});



// Actualizar comprado
app.put("/productos/:id", async (req, res) => {

    const id = req.params.id;
    const comprado = req.body.comprado;

    try {

        await db.query(

            "UPDATE productos SET comprado=$1 WHERE id=$2",

            [
                comprado,
                id
            ]

        );

        io.emit("producto actualizado", {
            id: id,
            comprado: comprado
        });

        res.sendStatus(200);

    } catch (error) {

        console.log(error);
        res.sendStatus(500);

    }

});




io.on("connection", (socket) => {

    console.log("Cliente conectado:", socket.id);

});




server.listen(PORT, () => {

    console.log(`Servidor iniciado en http://localhost:${PORT}`);

});