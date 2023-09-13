const { client, xml } = require('@xmpp/client');
const chalk = require('chalk');
const readline = require('readline');
const DistanceVector = require('./DistanceVector');
const utils = require('./utils');

class XMPPClient {
    constructor(jid, password, distanceVector) {
        this.jid = jid;
        this.password = password;
        this.distanceVector = distanceVector;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        this.xmpp = client({
            service: "xmpp://alumchat.xyz:5222",
            domain: 'alumchat.xyz',
            username: this.jid,
            password: this.password
        });

        this.setupListeners();
    }

    setupListeners() {
        this.xmpp.on('error', err => {
            console.error(chalk.red('❌', err.toString()));
        });

        this.xmpp.on('online', address => {
            console.log(chalk.green(`🎉 Connected as ${address.toString()}`));
        });

        this.xmpp.on('stanza', stanza => {
            if (stanza.is('message')) {
                this.handleMessage(stanza);
            }
        });

        this.xmpp.start().catch(console.error);
    }

    handleMessage(stanza) {
        const from = stanza.attrs.from;
        const body = stanza.getChild('body');
        if (body) {
            console.log(chalk.green(`Received a message from ${from}: ${body.text()}`));

            const messageData = JSON.parse(body.text());

            switch (messageData.type) {
                case 'routingUpdate':
                    this.distanceVector.update(messageData.neighbors, from);
                    break;
                case 'userMessage':
                    console.log(chalk.blue(`Message from ${from}: ${messageData.content}`));
                    break;
            }
        }
    }

    sendMessage(to, messageContent) {
        const msg = xml(
            "message",
            { type: "chat", to: to },
            xml("body", {}, JSON.stringify({ type: 'userMessage', content: messageContent }))
        );
        this.xmpp.send(msg);
    }

    async cliInteractions() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        while (true) {
            console.log(chalk.yellow("Choose an action:"));
            console.log("1. Send a message");
            console.log("2. View routing table");
            console.log("3. Exit");

            const choice = await new Promise(resolve => rl.question("Enter your choice: ", resolve));

            switch (choice) {
                case '1':
                    const recipient = await new Promise(resolve => rl.question("Enter the recipient's JID: ", resolve));
                    const message = await new Promise(resolve => rl.question("Enter your message: ", resolve));
                    this.sendMessage(recipient, message);
                    break;
                case '2':
                    console.log("Current Routing Table:", this.distanceVector.routingTable);
                    break;
                case '3':
                    console.log(chalk.green("Exiting..."));
                    rl.close();
                    process.exit(0);
                    break;
                default:
                    console.log(chalk.red("Invalid choice. Please try again."));
            }
        }
    }
}


async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Welcome to the XMPP Client!");

    // Prompt for username and password
    const username = await new Promise(resolve => rl.question("Enter your username: ", resolve));
    const password = await new Promise(resolve => rl.question("Enter your password: ", resolve));

    // Create the DistanceVector instance
    const myDistanceVector = new DistanceVector(username, 1);

    // Create the XMPPClient instance with the entered credentials
    const myClient = new XMPPClient(username, password, myDistanceVector);

    // Close the readline interface as it's no longer needed
    rl.close();

    // Start CLI interactions
    await myClient.cliInteractions();
}


main();
// Example usage:
// const myDistanceVector = new DistanceVector('username', 1);
// const myClient = new XMPPClient('a_g9', 'qwe123', myDistanceVector);
// myClient.cliInteractions();
