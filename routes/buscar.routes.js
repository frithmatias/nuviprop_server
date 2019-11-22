var express = require('express');
var app = express();

// Controllers
var BusquedaController = require('../controllers/buscar.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/:coleccion/:patron', BusquedaController.buscarEnColeccion);
app.get('/:patron', BusquedaController.buscarTodasColecciones);

module.exports = app;