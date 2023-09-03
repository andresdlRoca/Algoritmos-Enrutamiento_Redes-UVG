const Node = require('./node');

class Graph {
  constructor() {
    this.nodes = {};
  }

  addNode(name) {
    this.nodes[name] = new Node(name);
  }

  addEdge(source, target, weight) {
    this.nodes[source].addNeighbor(target, weight);
    this.nodes[target].addNeighbor(source, weight);
  }

  dijkstra(startNode) {
    const distances = {};
    const visited = {};
    const previousNodes = {};

    for (const node in this.nodes) {
      distances[node] = Infinity;
      previousNodes[node] = null;
    }
    distances[startNode] = 0;

    while (true) {
      let closestNode = null;
      let shortestDistance = Infinity;

      for (const node in distances) {
        if (!visited[node] && distances[node] < shortestDistance) {
          closestNode = node;
          shortestDistance = distances[node];
        }
      }

      if (closestNode === null) {
        break;
      }

      visited[closestNode] = true;

      for (const neighbor in this.nodes[closestNode].neighbors) {
        const distance = shortestDistance + this.nodes[closestNode].neighbors[neighbor];
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previousNodes[neighbor] = closestNode;
        }
      }
    }

    const shortestPath = {};
    for (const node in distances) {
      const path = [];
      let current = node;
      while (current !== startNode) {
        path.unshift(current);
        current = previousNodes[current];
      }
      path.unshift(startNode);
      shortestPath[node] = { distance: distances[node], path: path };
    }

    return { distances, shortestPath };
  }

  sendMessage(from, to, message) {
    const shortestPathInfo = this.dijkstra(from);
    const shortestPath = shortestPathInfo.shortestPath[to];
  
    if (!shortestPath) {
      console.log(`No se puede enviar el mensaje desde ${from} a ${to}. No hay una conexión directa.`);
      return;
    }
  
    const headers = {
      from: from,
      to: to,
      hop_count: shortestPath.length - 1,
    };
  
    const messageObject = {
      type: "message",
      headers: headers,
      payload: message,
    };
  
    console.log(`Mensaje enviado de ${from} a ${to}:`, messageObject);
  
    // Ahora llamamos al método receiveMessage del nodo de destino
    this.nodes[to].receiveMessage(JSON.stringify(headers));
  }
}

module.exports = Graph;
