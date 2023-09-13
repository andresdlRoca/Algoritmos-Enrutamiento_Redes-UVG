class Graph {
  constructor() {
    this.nodes = {}; // Un objeto para almacenar los nodos del grafo
  }

  // Método para agregar un nodo al grafo
  addNode(name) {
    this.nodes[name] = {}; // Usamos un objeto vacío para representar los vecinos de un nodo
  }

  // Método para agregar una conexión (arista) entre dos nodos con un peso
  addEdge(node1, node2, weight) {
    this.nodes[node1][node2] = weight;
    this.nodes[node2][node1] = weight; // Como es un grafo no dirigido, agregamos conexiones en ambas direcciones
  }

  // Método para enviar un mensaje desde un nodo de origen a un nodo de destino
  sendMessage(from, to, message) {
    // Función para encontrar el nodo con la distancia más corta en el conjunto de nodos no visitados
    function findClosestNode(distances, visitedNodes) {
      let closestNode = null;
      let shortestDistance = Infinity;
  
      for (const node in distances) {
        if (!visitedNodes[node] && distances[node] < shortestDistance) {
          closestNode = node;
          shortestDistance = distances[node];
        }
      }
  
      return closestNode;
    }
  
    // Inicializar las estructuras de datos necesarias para el algoritmo de Dijkstra
    const distances = {};
    const previousNodes = {};
    const visitedNodes = {};
  
    for (const node in this.nodes) {
      distances[node] = Infinity;
      previousNodes[node] = null;
    }
  
    distances[from] = 0;
  
    // Aplicar el algoritmo de Dijkstra
    while (true) {
      const closestNode = findClosestNode(distances, visitedNodes);
  
      if (closestNode === null) {
        break;
      }
  
      visitedNodes[closestNode] = true;
  
      for (const neighbor in this.nodes[closestNode]) {
        const distance = distances[closestNode] + this.nodes[closestNode][neighbor];
  
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previousNodes[neighbor] = closestNode;
        }
      }
    }
  
    // Reconstruir el camino más corto desde 'from' hasta 'to'
    const shortestPath = [to];
    let current = to;
  
    while (current !== from) {
      current = previousNodes[current];
      shortestPath.unshift(current);
    }
  
    // Enviar el mensaje al nodo de destino
    console.log(`Mensaje enviado de ${from} a ${to}: ${message}`);
    console.log(`Ruta: ${shortestPath.join(" -> ")}`);
  }
}

module.exports = Graph;
