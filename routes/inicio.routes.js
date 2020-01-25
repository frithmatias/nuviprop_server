var express = require('express');
var app = express();

// Controllers
var inicioController = require('../controllers/inicio.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Form Avisos
app.get('/operaciones', inicioController.getOperaciones);
app.get('/inmuebles', inicioController.getInmuebles);
app.get('/unidades/:idparent', inicioController.getUnidades);
app.get('/cambio', inicioController.getCambio);
app.get('/provincias', inicioController.getProvincias);


app.get('/localidadesendepartamento/:idlocalidad', inicioController.getLocalidaesEnDepartamento);
module.exports = app;