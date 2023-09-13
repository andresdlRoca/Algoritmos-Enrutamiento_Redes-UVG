class DistanceVector {
    constructor(nodeName = null, nodeWeight = null) {
        this.nodeName = nodeName;
        this.nodeWeight = nodeWeight;
        this.routingTable = {};
        this.neighborCosts = {};
        this.nextHops = {};
        this.converged = false;
    }

    setRoutingTable(topologyNodes) {
        for (let node of topologyNodes) {
            if (node !== this.nodeName) {
                if (this.neighborCosts.hasOwnProperty(node)) {
                    this.routingTable[node] = this.neighborCosts[node];
                    this.nextHops[node] = node;
                } else {
                    this.routingTable[node] = Infinity;
                    this.nextHops[node] = null;
                }
            } else {
                this.routingTable[node] = 0;
            }
        }
    }

    update(neighbors, sendingNodeName) {
        for (let neighbor of neighbors) {
            if (neighbor !== this.nodeName) {
                if (!this.neighborCosts.hasOwnProperty(neighbor) && this.neighborCosts.hasOwnProperty(sendingNodeName) && this.routingTable[neighbor] === Infinity) {
                    let actualCost = this.routingTable[neighbor] || Infinity;
                    let newCost = this.routingTable[sendingNodeName] + 1;
                    this.routingTable[neighbor] = Math.min(actualCost, newCost);
                    this.nextHops[neighbor] = sendingNodeName;
                }
            }
        }
    }

    receiveMessage(sender, receiver, message) {
        if (receiver === this.nodeName) {
            console.log(`Message received from ${sender}: ${message}`);
        } else {
            let nextHop = this.nextHops[receiver];
            console.log(`Forwarding >> ${message} >> from: ${sender} -> ${receiver} through ${nextHop}`);
        }
    }

    isConverged() {
        return JSON.stringify(this.routingTable) === JSON.stringify(this.nextHops);
    }
}

module.exports = DistanceVector;
