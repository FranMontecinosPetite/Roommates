// POST /roommate en el servidor que
// ejecute una función asíncrona importada de un archivo externo al del servidor (la
// función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule
// en un JSON (roommates.json).
const axios = require("axios");
const fs = require("fs");

axios
    .get("https://randomuser.me/api/?inc=name")
    .then((datos) => {
        console.log(datos.data.results);
        const user= datos.data.results[0];
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
        const roommates = roommatesJSON.roommates;
        console.log(user);
        roommate= {
            name:user.name.first,
            lastname:user.name.last,
        };
        roommates.push(roommate);
        fs.writeFileSync("roommates.json", JSON.stringify({roommates:roommates},null,2));
    })

export default postRoommate;
