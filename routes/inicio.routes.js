var express = require('express');
var app = express();

// Controllers
var inicioController = require('../controllers/inicio.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Form Avisos
app.get('/prueba', inicioController.prueba);
app.get('/cambio', inicioController.getCambio);
app.get('/provincias', inicioController.getProvincias);

app.get('/operaciones', inicioController.getOperaciones);
app.get('/inmuebles', inicioController.getInmuebles);
app.get('/unidades/:idparent', inicioController.getUnidades);
app.get('/habitaciones', inicioController.getHabitaciones);


app.get('/localidadesendepartamento/:idlocalidad', inicioController.getLocalidaesEnDepartamento);
module.exports = app;