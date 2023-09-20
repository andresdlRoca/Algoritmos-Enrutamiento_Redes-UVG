const { client, xml } = require('@xmpp/client');
const readline = require('readline');
const Flooding = require('./Flooding');
const utils = require('./utils');
const topo = require('../Formats/topo.json');
const names = require('../Formats/names.json');

// Initialize the nodes using the DistanceVector class based on topo.json
let nodes = {};
for (let nodeName in topo.config) {
    let node = new Flooding(nodeName);
    node.setNeighbors(topo.config);
    nodes[nodeName] = node;
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
        rl.question('Choose an option:\n1. Send a message\n2. View neighbors\n3. Exit\n', (choice) => {
            switch (choice) {
                case '1':
                    rl.question('Enter the message to send: ', (message) => {
                        // Generate a unique message ID for flooding control
                        let messageId = Date.now() + "-" + selectedNode;
                        nodes[selectedNode].receiveMessage(selectedNode, message, messageId, xmpp, xml, names);
                        handleMenu();
                    });
                    break;
                case '2':
                    console.log('Neighbors for', selectedNode, ':', topo.config[selectedNode]);
                    handleMenu();
                    break;
                case '3':
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
    const xmpp = client({
        service: "xmpp://alumchat.xyz",
        domain: 'alumchat.xyz',
        username: names.config[selectedNode].split('@')[0],
        password: 'qwerty'
    });

    xmpp.on('error', (err) => {
        console.error(err);
    });

    xmpp.on('online', async (address) => {
        console.log('Online as', address.toString());
        handleMenu(); // Start with displaying the menu once a node is selected and connected to XMPP
    });

    xmpp.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const sender = stanza.attrs.from.split('@')[0].toUpperCase();  // Extracting node name from XMPP JID
            const messageId = stanza.getChildText('body').split('-')[0];   // Extracting unique message ID
            const message = stanza.getChildText('body').split('-')[1];     // Extracting the actual message

            nodes[selectedNode].receiveMessage(sender, message, messageId, xmpp);
        }
    });

    xmpp.start().catch(console.error);
});
