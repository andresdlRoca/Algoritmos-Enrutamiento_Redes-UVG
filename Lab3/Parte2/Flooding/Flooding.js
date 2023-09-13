class Flooding {
    constructor(nodeName = null, nodeWeight = null) {
        this.nodeName = nodeName;
        this.nodeWeight = nodeWeight;
        this.neighbors = [];
        this.seenMessages = new Set();
    }

    setNeighbors(topologyNodes) {
        this.neighbors = topologyNodes[this.nodeName] || [];
    }

    receiveMessage(sender, message, messageId, xmppClient, xmlFunc, namesConfig) {
        if (!this.seenMessages.has(messageId)) {
            // Mark the message as seen
            this.seenMessages.add(messageId);
            
            console.log(`Message received at ${this.nodeName} from ${sender}: ${message}`);
            
            // Propagate the message to neighbors
            for (let neighbor of this.neighbors) {
                if (neighbor !== sender) {  // Avoid sending the message back to the sender
                    console.log(`Forwarding >> ${message} >> from: ${this.nodeName} -> ${neighbor}`);
                    
                    // Send the XMPP message to the neighbor
                    xmppClient.send(xmlFunc(
                        'message',
                        { type: 'chat', to: namesConfig.config[neighbor] },
                        xmlFunc('body', {}, `${message}`)
                    ));
                }
            }
        }
    }
}

module.exports = Flooding;
