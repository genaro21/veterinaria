const express = require("express");
const routes = require("./routes");

const server = express();

//Settings
server.use(express.json());

//Routes
server.use(routes.amo);

server.use(routes.perro);

module.exports = server;
