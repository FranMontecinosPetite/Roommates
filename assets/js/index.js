// 2. Capturar los errores para condicionar el código a través del manejo de excepciones.
// Se debe considerar recalcular y actualizar las cuentas de los roommates luego de
// este proceso.
// 5. Devolver los códigos de estado HTTP correspondientes a cada situación
// 6. Enviar un correo electrónico a todos los roommates cuando se registre un nuevo
// gasto. Se recomienda agregar a la lista de correos su correo personal para verificar
// esta funcionalidad. (Opcional)

import axios from "./postRoommate.js"

import fs from "fs";
import express from 'express';
const app = express();
const { v4: uuidv4 } = import('uuid');
import bp from 'body-parser';
const port = 3000;

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


// function populateSelect(){
//     var roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf-8"));
//     const selectorRoommates = document.querySelector("#roommateSelect");
//         for (var i = 0; i < roommatesJSON.length; i++) {
//             selectorRoommates.innerHTML = selectorRoommates.innerHTML +
//                 '<option value="' + roommatesJSON.roommates[i]['name'] + '">' + roommatesJSON.roommates[i]['lastname'] + '</option>';
//         }
// }
// populateSelect();

//rutas gastos
app.get("/gastos", (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
    res.send(gastosJSON, null, 2);
});

app.post("/gastos", (req, res) => {
    const { roommate, descripcion, monto } = req.body;
    const gasto = { id: uuidv4().slice(30), roommate, descripcion, monto };
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
    const gastos = gastosJSON.gastos;
    gastos.push(gasto);
    fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
    res.send("Gasto agregado con éxito",);
    });

app.put("/gastos", (req, res) => {
    const { id, roommate, descripcion, monto } = req.body;
    const gasto = { id, roommate, descripcion, monto };
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
    const gastos = gastosJSON.gastos;
    gastosJSON.gastos = gastos.map((g) =>
        g.id === id ? gasto : g
    );
    fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
    res.send("Gasto modificado con éxito");
});
    
app.delete("/gastos", (req, res) => {
    const { id } = req.query;
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
    const gastos = gastosJSON.gastos;
    gastosJSON.gastos = gastos.filter((g) => g.id !== id);
    fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
    res.send("Gasto eliminado con éxito");
});

//ruta roommates
app.get("/roommates", (req, res) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
    res.send(roommatesJSON, null, 2);
});
    

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
  });


    