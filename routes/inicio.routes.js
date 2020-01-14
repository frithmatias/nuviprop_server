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
app.get('/localidadesendepartamento/:idlocalidad', inicioController.getLocalidaesEnDepartamento);

app.get('/unidades/:idparent', inicioController.getUnidades);
app.get('/avisos/:operacion?/:inmueble?/:localidad/:pagina', inicioController.getAvisosCriteria);
module.exports = app;