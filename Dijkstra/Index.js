const readline = require('readline');
const Graph = require('./graph');
const Node = require('./node');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Crear una instancia de Graph para la red
const network = new Graph();

// Crear nodos y conectar la red
network.addNode("A");
network.addNode("B");
network.addNode("C");
network.addEdge("A", "B", 2);
network.addEdge("B", "C", 3);

let currentNode = null;

function createNodeTerminal(nodeName) {
  const node = new Node(nodeName);

  // Simular la recepción de mensajes asincrónicamente
  node.receiveMessageCallback = (message) => {
    console.log(`Mensaje recibido en el nodo ${nodeName}: ${message}`);
  };

  // Función para mostrar el menú
  function displayMenu() {
    console.log(`--- Menú del nodo ${nodeName} ---`);
    console.log("1. Enviar mensaje");
    console.log("2. Cambiar a otro nodo");
    console.log("3. Salir");

    rl.question("Elija una opción (1/2/3): ", (option) => {
      switch (option) {
        case "1":
          rl.question("Ingrese el destinatario y el mensaje (Ejemplo: 'B Hola'): ", (input) => {
            const [to, message] = input.split(' ');
            network.sendMessage(nodeName, to, message);
            displayMenu();
          });
          break;
        case "2":
          rl.question("Ingrese el nombre del nodo al que desea cambiar (A/B/C): ", (newNode) => {
            if (network.nodes[newNode]) {
              currentNode = newNode;
              displayMenu();
            } else {
              console.log("Nodo no válido.");
              displayMenu();
            }
          });
          break;
        case "3":
          rl.close();
          break;
        default:
          console.log("Opción inválida.");
          displayMenu();
          break;
      }
    });
  }

  displayMenu();
}

console.log("Seleccione el nodo al que desea unirse:");
console.log("1. Node A");
console.log("2. Node B");
console.log("3. Node C");

rl.question("Elija un nodo (1/2/3): ", (option) => {
  switch (option) {
    case "1":
      currentNode = "A";
      createNodeTerminal(currentNode);
      break;
    case "2":
      currentNode = "B";
      createNodeTerminal(currentNode);
      break;
    case "3":
      currentNode = "C";
      createNodeTerminal(currentNode);
      break;
    default:
      console.log("Opción inválida.");
      rl.close();
      break;
  }
});
