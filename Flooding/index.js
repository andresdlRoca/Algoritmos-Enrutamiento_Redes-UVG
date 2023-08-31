import readline from 'readline';

class node_flooding {

    constructor(id, neighbors) {
        this.id = id;
        this.neighbors = neighbors;
    }

    sendMessage(senderId, receiverId, message) {
        console.log(`Mensaje enviado desde ${senderId} hacia ${receiverId}: ${message}`);
        receiveMessage(receiverId, senderId, message);
    }

    receiveMessage(receiverId, senderId, message) {
        console.log(`Mensaje recibido en nodo ${receiverId} desde nodo ${senderId}: ${message}`);
    }

}

function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("--- Menu Algoritmo Flooding ---")

}