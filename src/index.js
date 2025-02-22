const http = require('http');
const app = require('./app');
const logger = require("./utils/logger");

const port = process.env.PORT || 3000;

if (process.env.API_KEY === undefined) {
    logger.error('API_KEY is not set. Please set the API_KEY environment variable');
    process.exit(1);
}

process.on('uncaughtException', async (error) => {
    logger.error(`Uncaught Exception: ${error}`);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.warn(`Unhandled Rejection at Promise: ${promise}, reason: ${reason}`);
});

const server = http.createServer(app);
server.listen(port,() => {
    console.log(`"No man can win every battle, but no man should fall without a struggle." - Peter Parker`);
    logger.info(`Server is listening on port ${port}`);
});
