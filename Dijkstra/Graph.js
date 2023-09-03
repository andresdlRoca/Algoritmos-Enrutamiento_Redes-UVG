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
      const shortestPath = shortestPathInfo.shortestPath;
    
      // Verifica si el destino está en el camino más corto
      let destinationInShortestPath = false;
      for (let i = 0; i < shortestPath.length; i++) {
        if (shortestPath[i] === to) {
          destinationInShortestPath = true;
          break;
        }
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
      this.nodes[to].receiveMessage(message);
    }
      
  }
  
  module.exports = Graph;
  