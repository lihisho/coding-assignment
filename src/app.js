const express = require('express');
const app = express();

const movieActorRoutes = require('./routes/movieActorRoutes');

app.use('/', movieActorRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message
    })
})

module.exports = app;
