var express = require('express');
var app = express();

// Controllers
var BusquedaController = require('../controllers/busqueda.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/coleccion/:coleccion/:patron', BusquedaController.buscarEnColeccion);
app.get('/todo/:patron', BusquedaController.buscarTodasColecciones);

module.exports = app;