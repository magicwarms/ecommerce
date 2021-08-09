/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./items/items.router";
import { Server } from "node:http";
import { rateLimiter, speedLimiter } from "./utilities/rateSpeedLimiter";
dotenv.config();

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
app.use("/api/v1", rateLimiter, speedLimiter, itemsRouter);
// handle 404
app.use((_req: Request, res: Response) => {
    return res.status(404).json({
        success: true,
        data: {},
        message: "API route not found",
    });
});
// handle 500 Any error
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
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
            // throw new Error('Exit process.exit Node JS');
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

export default startServer;
