class Node {
    constructor(name) {
      this.name = name;
      this.neighbors = {};
    }
  
    addNeighbor(node, weight) {
      this.neighbors[node] = weight;
    }
  
    receiveMessage(message) {
      console.log(`Mensaje recibido en el nodo ${this.name}: ${message}`);
    }
  }
  
  module.exports = Node;
  