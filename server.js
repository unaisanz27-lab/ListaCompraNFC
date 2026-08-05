const express = require("express");
const path = require("path");

const db = require("./db/database");


const app = express();

const PORT = 3000;


app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));



app.get("/productos",(req,res)=>{


    db.all(
        "SELECT * FROM productos",
        [],
        (error,filas)=>{

            res.json(filas);

        }
    );


});



app.post("/productos",(req,res)=>{


    const nombre=req.body.nombre;


    db.run(
        "INSERT INTO productos(nombre) VALUES(?)",
        [nombre],

        function(){

            res.json({
                id:this.lastID,
                nombre:nombre,
                comprado:0
            });

        }
    );


});



app.delete("/productos/:id",(req,res)=>{


    db.run(
        "DELETE FROM productos WHERE id=?",
        [req.params.id]
    );


    res.sendStatus(200);


});



app.listen(PORT,()=>{

    console.log(
        `Servidor iniciado en http://localhost:${PORT}`
    );

});

app.put("/productos/:id",(req,res)=>{

    const comprado = req.body.comprado;


    db.run(
        "UPDATE productos SET comprado=? WHERE id=?",
        [
            comprado,
            req.params.id
        ],

        ()=>{
            res.sendStatus(200);
        }
    );

});