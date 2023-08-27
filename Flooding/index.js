class Node {
    constructor(id) {
        this.id = id;
        this.neighbors = [];
        this.routingTable = {};
    }

    addNeighbor(node) {
        this.neighbors.push(node);
    }

    addRoutingTableEntry(source, table) {
        this.routingTable[source] = table;
    }

    receiveMessage(message) {
        console.log("Node " + this.id + " received message " + message.content);
        if(message.destination === this.id) {
            console.log("Message reached destination");
            return;
        }

        for (const neightbor of this.neighbors) {
            neightbor.sendMessage(message);
        }

    }


    sendMessage(message) {
        console.log("Node " + this.id + " sending message " + message.content + " to " + message.destination);
        for (const neightbor of this.neighbors) {
            if (neightbor.id !== message.origin) {
                neightbor.receiveMessage(message);
        }
    }
    }

}

class Message {
    constructor(origin, destination, content) {
        this.origin = origin;
        this.destination = destination;
        this.content = content;
    }
}

//Creating nodes
const node1 = new Node('A');
const node2 = new Node('B');
const node3 = new Node('C');
const node4 = new Node('D');

//Adding neighbors
node1.addNeighbor(node2);
node1.addNeighbor(node3);
node2.addNeighbor(node1);
node2.addNeighbor(node4);
node3.addNeighbor(node1);
node3.addNeighbor(node4);
node4.addNeighbor(node2);
node4.addNeighbor(node3);

// Initialize routing tables
node1.addRoutingTableEntry(node1.id, {}); // Node 1 knows how to reach itself
node1.addRoutingTableEntry(node2.id, {node2: node2});
node1.addRoutingTableEntry(node3.id, {node3: node3});
node1.addRoutingTableEntry(node4.id, {node4: node4});

node2.addRoutingTableEntry(node1.id, {node1: node1});
node2.addRoutingTableEntry(node2.id, {});
node2.addRoutingTableEntry(node3.id, {});
node2.addRoutingTableEntry(node4.id, {node4: node4});

node3.addRoutingTableEntry(node1.id, {node1: node1});
node3.addRoutingTableEntry(node2.id, {});
node3.addRoutingTableEntry(node3.id, {});
node3.addRoutingTableEntry(node4.id, {node4: node4});

node4.addRoutingTableEntry(node1.id, {node1: node1});
node4.addRoutingTableEntry(node2.id, {node2: node2});
node4.addRoutingTableEntry(node3.id, {node3: node3});
node4.addRoutingTableEntry(node4.id, {});

// Sending messages
const message = new Message(node1.id, node4.id, "Hello");
node1.sendMessage(message);