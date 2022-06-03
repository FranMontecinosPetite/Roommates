// POST /roommate en el servidor que
// ejecute una función asíncrona importada de un archivo externo al del servidor (la
// función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule
// en un JSON (roommates.json).

const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const obtenerRoommate = async () => {
    const {data} = await axios.get('https://randomuser.me/api')
    const roommate = data.results[0]
    const user = {
        id: uuidv4().slice(30),
        nombre: `${roommate.name.first} ${roommate.name.last}` ,
    }
    return user
}


const guardarRoommate = async (roommate) => {
    const roommatesJSON = await fs.readFile("roommates.json", "utf8");
    const { roommates } = JSON.parse(roommatesJSON)
    roommates.push(roommate);
    await fs.writeFile("roommates.json", JSON.stringify({ roommates }, null, 2));
}

module.exports={obtenerRoommate, guardarRoommate}
