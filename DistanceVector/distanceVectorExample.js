// Definition of nodes with their identifiers
const nodes = [
    { id: 1, neighbors: [2, 3] },
    { id: 2, neighbors: [1, 3] },
    { id: 3, neighbors: [1, 2, 4] },
    { id: 4, neighbors: [3] }
];

// Routing tables for each node (initially with distances to themselves)
const routingTables = {};
nodes.forEach(node => {
    routingTables[node.id] = { [node.id]: 0 };
});

// Sends distance vector to all neighbors
function sendDistanceVector(node) {
    node.neighbors.forEach(neighborId => {
        console.log(`Distance vector of Node ${node.id} sent to Node ${neighborId}`);
        receiveDistanceVector(neighborId, node.id, routingTables[node.id]);
    });
}

// Simulates receiving a distance vector from a neighbor
function receiveDistanceVector(receiverId, senderId, vector) {
    console.log(`Node ${receiverId} received distance vector from Node ${senderId}`);
    let updated = false;
    for (let [node, distance] of Object.entries(vector)) {
        if (!routingTables[receiverId][node] || routingTables[receiverId][node] > distance + 1) {
            routingTables[receiverId][node] = distance + 1;
            updated = true;
        }
    }
    if (updated) {
        // If the routing table was updated, propagate the changes to neighbors
        sendDistanceVector(nodes.find(node => node.id === receiverId));
    }
}

// Demonstration
console.log("Initial routing tables:", JSON.stringify(routingTables, null, 2));

// Start the simulation by having Node 1 send its distance vector to its neighbors
sendDistanceVector(nodes.find(node => node.id === 1));

console.log("Updated routing tables:", JSON.stringify(routingTables, null, 2));
