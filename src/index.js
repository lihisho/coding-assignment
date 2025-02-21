const http = require('http');
const app = require('./app');
const logger = require("./logger/logger");

const port = process.env.PORT || 3000;

process.on('uncaughtException', async (error) => {
    logger.error(`Uncaught Exception: ${error}`);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.warn(`Unhandled Rejection at Promise: ${promise}, reason: ${reason}`);
});

const server = http.createServer(app);
server.listen(port,() => {
    logger.info(`Server is listening on port ${port}`);
    //todo - add phrase
});
