/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import cluster from "cluster";
import os from "os";
import cors from "cors";
import helmet from "helmet";

dotenv.config();
import logger from "./config/logger";

import { userRouter } from "./user/user.router";
import { rateLimiter, speedLimiter } from "./utilities/rateSpeedLimiter";

const numCPUS = os.cpus().length;

/**
 * Set timezone
 */
process.env.TZ = "Asia/Jakarta";

const currentTime = new Date(Date.now()).toTimeString();
/**
 * App Variables
 */
if (!process.env.APP_PORT) {
    console.log(`Server exit without set PORT`);
    process.exit(1);
}

const PORT: number = parseInt(process.env.APP_PORT as string, 10);
const app = express();
/**
 *  App Configuration
 */
app.use(helmet());
app.use(
    cors({
        origin: "*",
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", rateLimiter, speedLimiter, userRouter);
// handle 404
app.use((_req: Request, res: Response) => {
    return res.status(404).json({
        success: true,
        data: {},
        message: "API route not found",
    });
});
// handle 422 Any error
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ message: err });
    return res.status(422).json({
        success: false,
        data: err,
        message: `User input error`,
    });
});
// handle 500 Any error
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    logger.error({ message: err });
    return res.status(500).json({
        success: false,
        data: {},
        message: `Error! (${err.message})`,
    });
});

// ensures we close the server in the event of an error.
function setupCloseOnExit(server: Server) {
    async function exitHandler(options = { exit: false }) {
        server.close();
        console.info(`Server successfully closed at ${currentTime}`);
        if (options.exit) {
            process.exit(1);
        }
    }

    // do something when app is closing
    process.on("exit", exitHandler);
    // catches ctrl+c event
    process.on("SIGINT", exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
    // catches uncaught exceptions
    process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

/**
 * Setup server connection here
 */
const startServerCluster = () => {
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
            .catch((err) => {
                console.error(err);
                logger.error(err);
            });
    }
};

const startServerDevelopment = () => {
    console.info("Development server mode started!");
    // Activate if development mode
    startServer()
        .then()
        .catch((err) => {
            console.error(err);
            logger.error(err);
        });
};

/**
 * Server Activation
 */
function startServer() {
    const NodeAppInstanceEnvValue: number = parseInt(process.env.NODE_APP_INSTANCE as string, 10);
    const nodeAppInstancePort =
        process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
            ? PORT + NodeAppInstanceEnvValue
            : PORT;
    return new Promise((resolve) => {
        const server = app.listen(nodeAppInstancePort, () => {
            console.info(`Listening on port ${PORT} at ${currentTime}`);
            // this ensures that we properly close the server when the program exists
            setupCloseOnExit(server);
            // resolve the whole promise with the express server
            resolve(server);
        });
    });
}

if (process.env.NODE_ENV === "development") {
    startServerDevelopment();
} else {
    startServerCluster();
}
