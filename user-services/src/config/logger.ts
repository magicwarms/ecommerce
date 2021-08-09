import { createLogger, transports, format } from "winston";
import path from "path";

// Debugging purpose with winston
const logger = createLogger({
    level: "info",
    format: format.json({ space: 2 }),
    transports: [
        // Write all logs with level `error` and below to `error.log`
        new transports.File({
            filename: path.join(__dirname, "../logs/errors.log"),
            level: "error",
        }),
    ],
});

export default logger;
