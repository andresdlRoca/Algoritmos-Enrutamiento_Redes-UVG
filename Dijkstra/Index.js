const Graph = require('./graph'); // Asegúrate de que el archivo de la clase Graph está en la misma carpeta

const graph = new Graph();

graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addNode("D");

graph.addEdge("A", "B", 2);
graph.addEdge("B", "C", 3);
graph.addEdge("C", "D", 1);

graph.sendMessage("A", "D", "Hola, nodo D!");
