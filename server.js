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

app.use(express.static(path.join(__dirname,"public")));



// Obtener productos
app.get("/productos",(req,res)=>{

    db.all(
        "SELECT * FROM productos",
        [],
        (error,filas)=>{

            if(error){
                console.log(error);
                return res.sendStatus(500);
            }

            res.json(filas);

        }
    );

});




// Añadir producto
app.post("/productos",(req,res)=>{

    const nombre=req.body.nombre;


    db.run(
        "INSERT INTO productos(nombre, comprado) VALUES(?,0)",
        [nombre],

        function(error){

            if(error){
                console.log(error);
                return res.sendStatus(500);
            }


            const producto={
                id:this.lastID,
                nombre:nombre,
                comprado:0
            };


            io.emit("producto añadido", producto);


            res.json(producto);

        }
    );

});




// Eliminar
app.delete("/productos/:id",(req,res)=>{


    const id=req.params.id;


    db.run(
        "DELETE FROM productos WHERE id=?",
        [id],

        function(error){

            if(error){
                console.log(error);
                return res.sendStatus(500);
            }


            io.emit("producto eliminado", id);


            res.sendStatus(200);

        }
    );


});




// Actualizar comprado
app.put("/productos/:id",(req,res)=>{


    const id=req.params.id;
    const comprado=req.body.comprado;


    db.run(
        "UPDATE productos SET comprado=? WHERE id=?",
        [
            comprado,
            id
        ],

        function(error){

            if(error){
                console.log(error);
                return res.sendStatus(500);
            }


            io.emit("producto actualizado",{
                id:id,
                comprado:comprado
            });


            res.sendStatus(200);

        }
    );


});





io.on("connection",(socket)=>{

    console.log("Cliente conectado:",socket.id);

});





server.listen(PORT,()=>{

    console.log(
        `Servidor iniciado en http://localhost:${PORT}`
    );

});