const readline = require('readline');

class NodeDistanceVector {
    constructor(id, neighbors) {
        this.id = id;
        this.neighbors = neighbors;
        this.distanceVector = { [id]: 0 };  // Distance to itself is 0
        this.routingTable = {};  // Keeps track of the next hop for each destination
    }

    sendDistanceVector(nodes) {
        for (let neighborId in this.neighbors) {
            const neighbor = nodes.find(node => node.id === neighborId);
            if (neighbor) {
                neighbor.receiveDistanceVector(this.id, this.distanceVector, nodes);
            }
        }
    }

    receiveDistanceVector(senderId, vector, nodes) {
        let hasChanges = false;
        for (let [node, distance] of Object.entries(vector)) {
            if (node !== this.id && (!this.distanceVector[node] || this.distanceVector[node] > this.neighbors[senderId] + distance)) {
                this.distanceVector[node] = this.neighbors[senderId] + distance;
                this.routingTable[node] = senderId;
                hasChanges = true;
            }
        }
        if (hasChanges) {
            this.sendDistanceVector(nodes);
        }
    }

    sendMessage(destination, message, nodes) {
        const route = [];
        let currentNode = this;
        while (currentNode && currentNode.id !== destination) {
            route.push(currentNode.id);
            if (!currentNode.routingTable[destination]) { // If the destination is not in the routing table
                return null;
            }
            currentNode = nodes.find(node => node.id === currentNode.routingTable[destination]);
        }
        route.push(destination);
    
        // Print the message being sent between each hop
        for (let i = 0; i < route.length - 1; i++) {
            console.log(`Message sent from Node ${route[i]} to Node ${route[i + 1]}: "${message}"`);
        }
    
        return route.join(' -> ');
    }
    


    printDistanceVector() {
        console.log(`Distance vector of Node ${this.id}:`, this.distanceVector);
    }

    printRoutingTable() {
        console.log(`Routing table of Node ${this.id}:`, this.routingTable);
    }

    printNeighborsTable() {
        console.log(`Neighbors table of Node ${this.id}:`, this.neighbors);
    }
}

function convergeNetwork(nodes) {
    nodes.forEach(node => node.sendDistanceVector(nodes));
}

function nodeMenu(node, nodes) {
    console.log("--- Menu for Node " + node.id + " ---");
    console.log("1. Send a message");
    console.log("2. View routing table");
    console.log("3. View topology");
    console.log("4. View neighbors table");1
    console.log("5. Exit");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.question("Choose an option: ", (option) => {
        switch (option) {
            case "1":
                rl.question("Enter destination node ID: ", (destinationId) => {
                    rl.question("Enter the message: ", (message) => {
                        const route = node.sendMessage(destinationId, message, nodes);
                        if (route) {
                            console.log(`Message sent via route: ${route}`);
                        } else {
                            console.log(`Error: Node ${destinationId} does not exist or is not reachable from Node ${node.id}`);
                        }
                        nodeMenu(node, nodes);
                    });
                });
                break;
            case "2":
                node.printRoutingTable();
                nodeMenu(node, nodes);
                break;
            case "3":
                nodes.forEach(node => node.printDistanceVector());
                nodeMenu(node, nodes);
                break;
            case "4":
                node.printNeighborsTable();
                nodeMenu(node, nodes);
                break;
            case "5":
                rl.close();
                break;
            default:
                console.log("Invalid option");
                nodeMenu(node, nodes);
                break;
        }
    });
}

function main() {
    const nodes = [
        new NodeDistanceVector('A', { 'B': 7, 'I': 1, 'C': 7 }),
        new NodeDistanceVector('B', { 'A': 7, 'F': 2 }),
        new NodeDistanceVector('C', { 'A': 7, 'D': 5 }),
        new NodeDistanceVector('D', { 'C': 5, 'I': 6, 'F': 1, 'E': 1 }),
        new NodeDistanceVector('E', { 'D': 1, 'G': 4 }),
        new NodeDistanceVector('F', { 'B': 2, 'D': 1, 'H': 4, 'G': 3 }),
        new NodeDistanceVector('G', { 'E': 4, 'F': 3 }),
        new NodeDistanceVector('H', { 'F': 4 }),
        new NodeDistanceVector('I', { 'A': 1, 'D': 6 })
    ];

    convergeNetwork(nodes);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.question("Which node would you like to interact with (A-I)? ", (nodeId) => {
        const selectedNode = nodes.find(node => node.id === nodeId);
        if (selectedNode) {
            nodeMenu(selectedNode, nodes);
        } else {
            console.log("Invalid node selection");
            rl.close();
        }
    });
}

main();
