const readline = require('readline');
const Graph = require('./graph');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const graph = new Graph();

graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addNode("D");
graph.addNode("E");
graph.addNode("F");
graph.addNode("G");
graph.addNode("H");
graph.addNode("I");

graph.addEdge("A", "B", 7);
graph.addEdge("A", "C", 7);
graph.addEdge("A", "I", 1);
graph.addEdge("B", "F", 2);
graph.addEdge("F", "D", 1);
graph.addEdge("I", "D", 6);
graph.addEdge("C", "D", 5);
graph.addEdge("F", "H", 4);
graph.addEdge("F", "G", 3);
graph.addEdge("D", "E", 1);
graph.addEdge("G", "E", 4);

function displayMenu() {
  console.log("--- Menú ---");
  console.log("1. Enviar mensaje");
  console.log("2. Salir");

  rl.question("Elija una opción (1/2): ", (option) => {
    switch (option) {
      case "1":
        rl.question("Ingrese el nodo de origen: ", (from) => {
          rl.question("Ingrese el nodo de destino: ", (to) => {
            rl.question("Ingrese el tipo (message/echo/info): ", (type) => {
              rl.question("Ingrese el mensaje: ", (message) => {
                const headers = {
                  type: type,
                  from: from,
                  to: to,
                  hop_count: 0, // Inicialmente, el salto es 0
                };

                const messageObject = {
                  type: headers.type,
                  headers: headers,
                  payload: message,
                };

                graph.sendMessage(from, to, messageObject);
                displayMenu();
              });
            });
          });
        });
        break;
      case "2":
        rl.close();
        break;
      default:
        console.log("Opción inválida.");
        displayMenu();
        break;
    }
  });
}

console.log("Bienvenido a la red de mensajes.");
displayMenu();
