const readline = require('readline');

class NodeDistanceVector {

    constructor(id, neighbors) {
        this.id = id;
        this.neighbors = neighbors;
        this.distanceVector = { [id]: 0 };  // Distance to itself is 0
    }

    // Sends distance vector to all neighbors
    sendDistanceVector() {
        this.neighbors.forEach(neighborId => {
            console.log(`Distance vector of Node ${this.id} sent to Node ${neighborId}`);
            // In a real-world scenario, the neighbor node would then process this distance vector
        });
    }

    // Simulates receiving a distance vector from a neighbor
    receiveDistanceVector(senderId, vector) {
        console.log(`Received distance vector from Node ${senderId}`);
        // Update this node's distance vector based on the received data
        for (let [node, distance] of Object.entries(vector)) {
            if (!this.distanceVector[node] || this.distanceVector[node] > distance + 1) {
                this.distanceVector[node] = distance + 1;
            }
        }
        this.sendDistanceVector();  // Propagate the changes to neighbors
    }

    printDistanceVector() {
        console.log(`Distance vector of Node ${this.id}:`, this.distanceVector);
    }
}

function nodeMenu(node) {
    console.log("--- Menu for Node " + node.id + " ---");
    console.log("1. Print distance vector");
    console.log("2. Simulate receiving distance vector");
    console.log("3. Exit");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.question("Choose an option: ", (option) => {
        switch (option) {
            case "1":
                node.printDistanceVector();
                nodeMenu(node);
                break;
            case "2":
                rl.question("Enter the sender node ID: ", (senderId) => {
                    // For simplicity, we'll simulate a distance vector with a single entry
                    rl.question("Enter the node ID in the received vector: ", (vectorNodeId) => {
                        rl.question("Enter the distance for that node in the received vector: ", (distance) => {
                            const receivedVector = { [vectorNodeId]: parseInt(distance) };
                            node.receiveDistanceVector(senderId, receivedVector);
                            nodeMenu(node);
                        });
                    });
                });
                break;
            case "3":
                rl.close();
                process.exit();
            default:
                console.log("Invalid option");
                nodeMenu(node);
                break;
        }
    });
}

function main() {
    // Sample nodes
    const nodes = [
        new NodeDistanceVector(1, [2, 3]),
        new NodeDistanceVector(2, [1, 3]),
        new NodeDistanceVector(3, [1, 2, 4]),
        new NodeDistanceVector(4, [3])
    ];

    // Choose a node to interact with
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.question("Which node would you like to interact with (1-4)? ", (nodeId) => {
        const selectedNode = nodes.find(node => node.id === parseInt(nodeId));
        if (selectedNode) {
            nodeMenu(selectedNode);
        } else {
            console.log("Invalid node selection");
            rl.close();
        }
    });
}

main();
