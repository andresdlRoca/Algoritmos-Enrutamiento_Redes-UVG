// Definición de nodos con sus identificadores
const nodes = [
    { id: 1, neighbors: [2, 3] },
    { id: 2, neighbors: [1, 3] },
    { id: 3, neighbors: [1, 2, 4] },
    { id: 4, neighbors: [3] }
  ];
  
  // Tablas de enrutamiento para cada nodo (inicialmente vacías)
  const routingTables = {};
  
  // Inicialización de las tablas de enrutamiento
  nodes.forEach(node => {
    routingTables[node.id] = { [node.id]: node.id }; // Cada nodo puede enrutar a sí mismo
  });
  
  // Función para enviar un mensaje a todos los nodos vecinos
  function floodMessage(senderId, message) {
    const senderNode = nodes.find(node => node.id === senderId);
    senderNode.neighbors.forEach(neighborId => {
      if (!routingTables[senderId][neighborId]) {
        routingTables[senderId][neighborId] = senderId;
        console.log(`Se agregó ruta desde ${senderId} hacia ${neighborId}`);
      }
      sendMessage(senderId, neighborId, message);
    });
  }
  
  // Función para enviar un mensaje de un nodo a otro
  function sendMessage(senderId, receiverId, message) {
    const receiverNode = nodes.find(node => node.id === receiverId);
    console.log(`Mensaje enviado desde ${senderId} hacia ${receiverId}: ${message}`);
    
    // Simulación de recepción del mensaje por el nodo receptor
    receiveMessage(receiverId, senderId, message);
  }
  
  // Función para recibir un mensaje en un nodo
  function receiveMessage(receiverId, senderId, message) {
    console.log(`Mensaje recibido en nodo ${receiverId} desde nodo ${senderId}: ${message}`);
  }
  
  // Simulación de envío de mensaje desde el nodo 1 al nodo 4
  floodMessage(1, "Hola, nodo 4!");
  