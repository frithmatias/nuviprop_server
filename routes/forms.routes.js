var express = require('express');
var app = express();

// Controllers
var FormsController = require('../controllers/forms.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/getcontrols/:tipooperacion/:tipoinmueble', FormsController.getFormControls);
app.get('/getcontrolsdata/:tipooperacion/:tipoinmueble', FormsController.getFormControlsAndData);
app.get('/getallcontrols', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.getAllControls);
app.put('/setformcontrols', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.setFormControls);
app.post('/createcontrol', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.createControl);

module.exports = app;