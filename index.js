const express = require('express');
const app = express();
app.use(express.json())
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { obtenerRoommate, guardarRoommate } = require("./postRoommate.js");
const sendMail = require("./correo.js");
const port = 3000;

/* Sending the index.html file to the browser. */
app.get("/", (req,res)=>{
    try {
        res.sendFile(__dirname + "/index.html")
    } catch (error) {
        res.send(error)
    }
})


/* Creating a new roommate and saving it to the database. */
app.post("/roommates", async (req, res) => {
    try {
      const roommate = await obtenerRoommate()
      await guardarRoommate(roommate)
      res.send(roommate)
    } catch (error) {
      res.send(error)
    }
})

/* Sending the roommates.json file to the browser. */
app.get("/roommates", (req, res) => {
    try {
        res.sendFile(__dirname + "/roommates.json");

    } catch (error) {
        res.send(error)
    }
})
  
/* Sending the gastos.json file to the browser. */
app.get("/gasto", async (req, res) => {
    try {
        res.sendFile(__dirname + "/gastos.json");
    } catch (error) {
        res.send(error)
    }
});

/* Creating a new expense and saving it to the database. */
app.post("/gasto", async (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id: uuidv4().slice(30), roommate, descripcion, monto };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
        const gastos = gastosJSON.gastos;
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
        const roommates = roommatesJSON.roommates;
        gastos.push(gasto);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
        const division = monto/roommates.length;
        roommates.map((r) =>
            r.nombre === roommate 
                ? r.recibe += (monto - division) 
                : r.debe += division
        );
        fs.writeFileSync("roommates.json", JSON.stringify({roommates}, null, 2));
        sendMail(roommate)
        res.send("Gasto agregado con éxito",);
    } catch (error) {
        res.send(error)
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
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
        const roommates = roommatesJSON.roommates; 
        let diferencia = 0;       
        gastosJSON.gastos = gastos.map((g) =>{
            if (g.id === id) {
                diferencia =  - (parseInt(g.monto) - parseInt(gasto.monto) );
                return gasto  
            } else {
                return g
            }
        });
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
        const division = diferencia/roommates.length;
        roommates.map((r) =>
            r.nombre === roommate 
                ? r.recibe += division * (roommates.length - 1)
                : r.debe += division
        );
        fs.writeFileSync("roommates.json", JSON.stringify({roommates}, null, 2));
        res.send("Gasto modificado con éxito");
    } catch (error) {
        res.send(error)
    }
});
    
/* Deleting the expense from the database. */
app.delete("/gasto", (req, res) => {
    try {
        const { id } = req.query;
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json","utf8"));
        const gastos = gastosJSON.gastos;    
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
        const roommates = roommatesJSON.roommates; 
        let diferencia = 0;    
        let roommate =  '';  
        gastosJSON.gastos = gastos.map((g) =>{
            if (g.id === id) {
                diferencia = parseInt(g.monto);
                roommate = g.roommate;
            }
        });
        gastosJSON.gastos = gastos.filter((g) => g.id !== id);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 2));
        const division = diferencia/roommates.length;
        roommates.map((r) =>
            r.nombre === roommate
                ? r.recibe -= division * (roommates.length - 1)
                : r.debe -= division
        );
        fs.writeFileSync("roommates.json", JSON.stringify({roommates}, null, 2));
        res.send("Gasto eliminado con éxito");
    } catch (error) {
        res.send(error)
    }
    
});


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
  });


    