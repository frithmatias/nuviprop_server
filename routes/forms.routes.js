var express = require('express');
var app = express();

// Controllers
var FormsController = require('../controllers/forms.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/:tipooperacion/:tipoinmueble', FormsController.getFormDetalles);
app.get('/getallcontrols', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.getAllControls);
app.put('/setformcontrols', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.setFormControls);

module.exports = app;