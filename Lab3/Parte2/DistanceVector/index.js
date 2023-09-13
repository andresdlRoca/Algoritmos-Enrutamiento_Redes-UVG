
const { client, xml } = require('@xmpp/client');
const readline = require('readline');
const DistanceVector = require('./DistanceVector');
const utils = require('./utils');
const topo = require('../Formats/topo.json');
const names = require('../Formats/names.json');


// Initialize the nodes using the DistanceVector class based on topo.json
let nodes = {};
for (let nodeName in topo.config) {
    let node = new DistanceVector(nodeName);
    node.neighborCosts = topo.config[nodeName].map(neighbor => ({ [neighbor]: 1 })).reduce((a, b) => Object.assign(a, b), {});
    nodes[nodeName] = node;
    node.setRoutingTable(Object.keys(topo.config));  // Initialize routing table based on direct neighbors
}

// Calculate best routes for all nodes upon reading topo.json
let hasConverged = false;

while (!hasConverged) {
    hasConverged = true;  // Assume the network has converged, and adjust if any changes are made

    for (let node in nodes) {
        let previousTable = { ...nodes[node].routingTable };

        for (let neighbor in nodes[node].neighborCosts) {
            nodes[node].update(Object.keys(nodes[neighbor].routingTable), neighbor);
        }

        if (JSON.stringify(previousTable) !== JSON.stringify(nodes[node].routingTable)) {
            hasConverged = false;  // If any routing table changed, the network has not converged
        }
    }
}



// Prompt the user to select a node from the available nodes
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please select a node from the list: ' + Object.keys(nodes).join(', ') + '\n', (selectedNode) => {
    if (!nodes[selectedNode]) {
        console.log('Invalid node selected.');
        rl.close();
        return;
    }

    
// Function to display the menu and handle user choices
function handleMenu() {
    rl.question('Choose an option:\n1. Send a message\n2. View routing table\n3. View neighbors\n4. Exit\n', (option) => {
        switch (option) {
            case '1':
                // Send a message logic
                rl.question('Enter the destination node: ', (destinationNode) => {
                    if (!nodes[destinationNode]) {
                        console.log('Invalid destination node.');
                        handleMenu();
                        return;
                    }

                    // Recursive function to send the message through each hop until it reaches the destination
                    function forwardMessage(currentNode, finalDestination, message) {
                        let nextHop = nodes[currentNode].nextHops[finalDestination];
                        if (!nextHop) {
                            console.log('No route available to the destination node from', currentNode);
                            return;
                        }
                        
                        // If nextHop is the final destination, deliver the message
                        if (nextHop === finalDestination) {
                            let destinationJID = names.config[finalDestination];
                            xmpp.send(xml(
                                'message',
                                { type: 'chat', to: destinationJID },
                                xml('body', {}, message)
                            ));
                            console.log('Message delivered to', finalDestination);
                        } else {
                            // Forward the message to the next hop
                            let hopJID = names.config[nextHop];
                            xmpp.send(xml(
                                'message',
                                { type: 'chat', to: hopJID },
                                xml('body', {}, message)
                            ));
                            console.log('Message forwarded to', nextHop, 'for eventual delivery to', finalDestination);
                            // Recursive call to continue forwarding
                            forwardMessage(nextHop, finalDestination, message);
                        }
                    }

                    rl.question('Enter the message to send: ', (message) => {
                        forwardMessage(selectedNode, destinationNode, message);
                        // Display the menu again
                        handleMenu();
                    });
                });
                break;
            case '2':
                console.log('Next hops for', selectedNode, ':', nodes[selectedNode].nextHops);
                handleMenu();
                break;
            case '3':
                console.log('Neighbors for', selectedNode, ':', topo.config[selectedNode]);
                handleMenu();
                break;
            case '4':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log('Invalid option selected.');
                handleMenu();
                break;
        }
    });
}



// Initialize an XMPP client for the selected node upon node selection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(names.config[selectedNode].split('@')[0])
const xmpp = client({
    service: "xmpp://alumchat.xyz",
    domain: 'alumchat.xyz',
    username: names.config[selectedNode].split('@')[0],
    password: 'qwerty' // password is qwerty for all of them
});

xmpp.on('error', (err) => {
    console.error(err);
});

xmpp.on('online', async (address) => {
    console.log('Online as', address.toString());
    handleMenu(); // Start with displaying the menu once a node is selected and connected to XMPP
});

xmpp.start().catch(console.error);



    
});
