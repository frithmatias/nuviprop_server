var express = require('express');
var app = express();

// Controllers
var dataController = require('../controllers/data.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/operaciones', dataController.getOperaciones);
app.get('/inmuebles', dataController.getInmuebles);
app.get('/unidades/:idparent', dataController.getUnidades);
module.exports = app;