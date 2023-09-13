const readline = require('readline');

class node_flooding {

    constructor(id, neighbors) {
        this.id = id;
        this.neighbors = neighbors;
    }

    sendMessage(senderId, receiverId, message) {
        console.log(`Mensaje enviado desde ${senderId} hacia ${receiverId}: ${message}`);
    }

    receiveMessage(receiverId, senderId, message) {
        console.log(`Mensaje recibido en nodo ${receiverId} desde nodo ${senderId}: ${message}`);
    }

}

function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    console.log("--- Algoritmo Flooding ---")
    rl.question("Ingrese el identificador de este nodo: ", (id) => {

        rl.question("Ingrese los identificadores de los nodos vecinos separados por coma: ", (neighbors) => {

            let neighborsArray = neighbors.split(",");
            let node = new node_flooding(id, neighborsArray);
            console.log("Nodo creado: ", node);
            rl.close();
            nodeMenu(node);


            // // Send custom message to all neighbors
            // rl.question("Ingrese el mensaje a enviar: ", (message) => {
            //     node.neighbors.forEach(neighborId => {
            //         node.sendMessage(node.id, neighborId, message);
            //     });
            // });

            
        });

    });
}


function nodeMenu(node) {
    console.log("--- Menu del nodo " + node.id + " ---")
    console.log("1. Enviar mensaje") // Sends custom message to all neighbors
    console.log("2. Recibir mensaje") // Receives message and resend it to all neighbors
    console.log("3. Salir")

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false

    });


    rl.question("Ingrese la opción: ", (option) => {
        switch (option) {
            case "1":
                rl.question("Ingrese el mensaje a enviar: ", (message) => {
                    node.neighbors.forEach(neighborId => {
                        node.sendMessage(node.id, neighborId, message);
                    });
                    nodeMenu(node);
                });
                break;
            case "2":
                rl.question("Ingrese el identificador del nodo que envió el mensaje: ", (senderId) => {
                    rl.question("Ingrese el mensaje recibido: ", (message) => {
                        node.receiveMessage(node.id, senderId, message);

                        // Send to all except sender
                        node.neighbors.forEach(neighborId => {
                            if (neighborId != senderId){
                                node.sendMessage(node.id, neighborId, message);
                            }
                        });
                        nodeMenu(node);
                    });
                });
                break;
            case "3":
                rl.close();
                break;
            default:
                console.log("Opción inválida");
                nodeMenu(node);
                break;
        }
    });

}

main();