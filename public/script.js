const boton = document.getElementById("agregar");
const input = document.getElementById("producto");
const lista = document.getElementById("lista");


// Cuando carga la página
window.onload = cargarProductos;



// Obtener productos del servidor
function cargarProductos(){

    fetch("/productos")
        .then(res => res.json())
        .then(productos => {

            productos.forEach(producto => {
                mostrarProducto(producto);
            });

        });

}



// Añadir producto
boton.addEventListener("click",()=>{


    const nombre=input.value.trim();


    if(nombre==="")
        return;



    fetch("/productos",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            nombre:nombre
        })

    })

    .then(res=>res.json())

    .then(producto=>{

        mostrarProducto(producto);

        input.value="";

    });


});





function mostrarProducto(producto){


    const li=document.createElement("li");


    const zonaProducto=document.createElement("div");

    zonaProducto.className="producto";



    const check=document.createElement("input");

    check.type="checkbox";

    check.className="check";



    const nombre=document.createElement("span");

    nombre.textContent=producto.nombre;



    // Si ya estaba comprado
    if(producto.comprado){

        check.checked=true;

        nombre.classList.add("comprado");

    }




    check.addEventListener("change",()=>{


    let estado = check.checked ? 1 : 0;



    fetch("/productos/"+producto.id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            comprado:estado
        })

    });



    if(check.checked){

        nombre.classList.add("comprado");

    }else{

        nombre.classList.remove("comprado");

    }


});




    zonaProducto.appendChild(check);

    zonaProducto.appendChild(nombre);





    const eliminar=document.createElement("button");


    eliminar.textContent="🗑️";

    eliminar.className="eliminar";



    eliminar.addEventListener("click",()=>{


        fetch("/productos/"+producto.id,{

            method:"DELETE"

        })

        .then(()=>{

            li.remove();

        });


    });





    li.appendChild(zonaProducto);

    li.appendChild(eliminar);


    lista.appendChild(li);


}