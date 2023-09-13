class LinkState {
    constructor(nodeName, topology) {
        this.nodeName = nodeName;
        this.topology = topology;
        this.linkStateDatabase = topology;
        this.computeShortestPath();
    }

    computeShortestPath() {
        const nodes = Object.keys(this.linkStateDatabase);
        const distances = {};
        const previous = {};
        const queue = nodes.slice();

        nodes.forEach(node => {
            distances[node] = Infinity;
            previous[node] = null;
        });
        distances[this.nodeName] = 0;

        while (queue.length) {
            queue.sort((a, b) => distances[a] - distances[b]);
            const current = queue.shift();

            (this.linkStateDatabase[current] || []).forEach(neighbor => {
                const alt = distances[current] + 1;  // Assuming all link costs are 1
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = current;
                }
            });
        }

        this.distances = distances;
        this.previous = previous;
    }

    getPathToDestination(destination) {
        const path = [];
        let current = destination;

        while (current !== null) {
            path.unshift(current);
            current = this.previous[current];
        }

        return path;
    }
}

module.exports = LinkState;
