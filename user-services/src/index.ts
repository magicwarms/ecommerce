import { createConnection } from "typeorm";

/**
 * Start server
 */
createConnection()
    .then(() => {
        console.log("Connected to the database");
        import("./start-server");
    })
    .catch(() => new Error("Unable to connect to the database"));
