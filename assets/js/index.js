const fs = require("fs");
const app = require("express")();
const { v4: uuidv4 } = require('uuid');
const bp = require('body-parser')
const port = 3000;

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


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

app.get("/roommates", (req, res) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
    res.send(roommatesJSON, null, 2);
});
    

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}.`);
  });


    