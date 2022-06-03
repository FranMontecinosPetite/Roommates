// POST /roommate en el servidor que
// ejecute una función asíncrona importada de un archivo externo al del servidor (la
// función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule
// en un JSON (roommates.json).
import axios from "axios";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

axios
    .get("https://randomuser.me/api/?inc=name")
    .then((datos) => {
        let roommate= datos.data.results[0];
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json","utf8"));
        const roommates = roommatesJSON.roommates;
        roommate= {
            id: uuidv4().slice(30),
            name:roommate.name.first,
            lastname:roommate.name.last,
        };
        roommates.push(roommate);
        fs.writeFileSync("roommates.json", JSON.stringify({roommates:roommates},null,2));
    })

export default axios;
