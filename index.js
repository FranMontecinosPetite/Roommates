// 2. Capturar los errores para condicionar el código a través del manejo de excepciones.
// Se debe considerar recalcular y actualizar las cuentas de los roommates luego de
// este proceso.
// 5. Devolver los códigos de estado HTTP correspondientes a cada situación
// 6. Enviar un correo electrónico a todos los roommates cuando se registre un nuevo
// gasto. Se recomienda agregar a la lista de correos su correo personal para verificar
// esta funcionalidad. (Opcional)

//PUT GASTO NO FUNCIONA

const express = require('express');
const app = express();
app.use(express.json())
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { obtenerRoommate, guardarRoommate } = require("./postRoommate.js");
const port = 3000;

// const send = require("./correo");

/* Sending the index.html file to the browser. */
app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html")
})


/* Creating a new roommate and saving it to the database. */
app.post("/roommates", async (req, res) => {
    try {
      const roommate = await obtenerRoommate()
      await guardarRoommate(roommate)
      res.send(roommate)
    } catch (error) {
      res.status(500).send(error)
    }
})

/* Sending the roommates.json file to the browser. */
app.get("/roommates", (req, res) => {
    res.sendFile(__dirname + "/roommates.json");
})
  
/* Sending the gastos.json file to the browser. */
app.get("/gasto", (req, res) => {
    res.sendFile(__dirname + "/gastos.json")
});

/* Creating a new expense and saving it to the database. */
app.post("/gasto", async (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id: uuidv4().slice(30), roommate, descripcion, monto };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
        const gastos = gastosJSON.gastos;
        gastos.push(gasto);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
        res.send("Gasto agregado con éxito",);
    } catch (error) {
      res.status(500).send(error)
    }
})


/* Updating the JSON file with the new data. */
app.put("/gasto", (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id, roommate, descripcion, monto };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
        const gastos = gastosJSON.gastos;
        gastosJSON.gastos = gastos.map((g) =>
            g.id === id ? gasto : g
        );
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
        res.send("Gasto modificado con éxito");
    } catch (error) {
        res.status(500).send(error)
    }
});
    
/* Deleting the expense from the database. */
app.delete("/gasto", (req, res) => {
    const { id } = req.query;
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
    const gastos = gastosJSON.gastos;
    gastosJSON.gastos = gastos.filter((g) => g.id !== id);
    fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
    res.send("Gasto eliminado con éxito");
});


    

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
  });


    