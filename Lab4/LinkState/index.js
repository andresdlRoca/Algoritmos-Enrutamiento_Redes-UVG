const { client, xml } = require('@xmpp/client');
const readline = require('readline');
const LinkState = require('./LinkState');
const topo = require('../Formats/topo.json');
const names = require('../Formats/names.json');

let nodes = {};
for (let nodeName in topo.config) {
    let node = new LinkState(nodeName, topo.config);
    nodes[nodeName] = node;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function handleMenu(selectedNodeName, xmpp) {
    rl.question('Choose an option:\n1. Send a message\n2. View neighbors\n3. Compute Shortest Path\n4. Exit\n', (option) => {
        switch (option) {
            case '1':
                rl.question('Enter the destination node: ', (destinationNode) => {
                    if (!nodes[destinationNode]) {
                        console.log('Invalid destination node.');
                        handleMenu(selectedNodeName, xmpp);
                        return;
                    }
                    rl.question('Enter the message to send: ', (message) => {
                        let path = nodes[selectedNodeName].getPathToDestination(destinationNode);

                        if (path.length < 2) {
                            console.log('Error: Cannot determine path to destination.');
                            handleMenu(selectedNodeName, xmpp);
                            return;
                        }

                        const nextNode = path[1];
                        console.log("Sending message to:", names.config[nextNode]);
                        xmpp.send(xml(
                            'message',
                            { type: 'chat', to: names.config[nextNode] },
                            xml('body', {}, message)
                        ));
                        console.log(`Message sent to ${nextNode} on the way to ${destinationNode}`);
                        handleMenu(selectedNodeName, xmpp);
                    });
                });
                break;
            case '2':
                console.log('Neighbors for', selectedNodeName, ':', topo.config[selectedNodeName]);
                handleMenu(selectedNodeName, xmpp);
                break;
            case '3':
                rl.question('Enter the destination node for the shortest path: ', (destinationNode) => {
                    if (!nodes[destinationNode]) {
                        console.log('Invalid destination node.');
                        handleMenu(selectedNodeName, xmpp);
                        return;
                    }
                    let path = nodes[selectedNodeName].getPathToDestination(destinationNode);
                    console.log('Shortest path from', selectedNodeName, 'to', destinationNode, ':', path.join(' -> '));
                    handleMenu(selectedNodeName, xmpp);
                });
                break;
            case '4':
                console.log('Exiting...');
                xmpp.stop();
                rl.close();
                break;
            default:
                console.log('Invalid option selected.');
                handleMenu(selectedNodeName, xmpp);
                break;
        }
    });
}

rl.question('Please select a node from the list: ' + Object.keys(nodes).join(', ') + '\n', (selectedNode) => {
    if (!nodes[selectedNode]) {
        console.log('Invalid node selected.');
        rl.close();
        return;
    }

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
        handleMenu(selectedNode, xmpp);
    });

    xmpp.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const sender = stanza.attrs.from.split('@')[0].toUpperCase();
            const message = stanza.getChildText('body');
            console.log(`Received message from ${sender}: ${message}`);
            handleMenu(selectedNode, xmpp);
        } else {
            handleMenu(selectedNode, xmpp);
        }
    });

    xmpp.start().catch(console.error);
});
