var express = require('express');
var app = express();

// Controllers
var inicioController = require('../controllers/inicio.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/operaciones', inicioController.getOperaciones);
app.get('/inmuebles', inicioController.getInmuebles);
app.get('/provincias', inicioController.getProvincias);

app.get('/unidades/:idparent', inicioController.getUnidades);
app.get('/propiedades/:operacion/:inmueble/:localidad/:pagina', inicioController.getPropsCriteria);
module.exports = app;