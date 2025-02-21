const express = require('express');
const app = express();

const actorRoutes = require('./routes/actors');

app.use('/', actorRoutes);


module.exports = app;