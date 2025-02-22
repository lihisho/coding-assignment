const winston = require('winston');
const {createLogger, format, transports} = winston;
const {combine, timestamp, printf, colorize, json, errors} = format;

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        errors({stack: true}),
        combine(colorize(), printf(({level, message, timestamp, stack}) => {
            return `${timestamp} [${level}]: ${stack || message}`;
        }))
    ),
    transports: [new transports.Console()],
});

module.exports = logger;
