import cluster from "cluster";
import os from "os";
import startServer from "./start-server";

const numCPUS = os.cpus().length;

/**
 * Setup database connection here
 */

/**
 * Setup server connection here
 */
function startServerCluster() {
    console.info("Production/Staging server mode started!");
    // Activate cluster for production mode
    if (cluster.isMaster) {
        console.info(`Master ${process.pid} is running`);
        for (let i = 0; i < numCPUS; i += 1) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code) => {
            // If cluster crashed, start new cluster connection
            if (code !== 0 && !worker.exitedAfterDisconnect) {
                console.warn("Cluster crashed, starting new cluster");
                cluster.fork();
            }
        });
    } else {
        startServer()
            .then()
            .catch((err) => console.error(err));
    }
}

function startServerDevelopment() {
    console.info("Development server mode started!");
    // activate if development mode
    startServer()
        .then()
        .catch((err) => console.error(err));
}

/**
 * Start server
 */
if (process.env.NODE_ENV === "development") {
    startServerDevelopment();
} else {
    startServerCluster();
}
