var express = require('express');
var app = express();

// Controllers
var FormsController = require('../controllers/forms.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/getcontrols/:tipooperacion/:tipoinmueble', FormsController.getFormControls);
app.get('/getcontrolsoptions/:tipooperacion/:tipoinmueble', FormsController.getFormControlsAndOptions);
app.get('/getcontroloptions/:idcontrol', FormsController.getControlOptions);

app.get('/getallcontrols', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.getAllControls);
app.put('/setformcontrols', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.setFormControls);
app.post('/createcontrol', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.createControl);
app.post('/editcontrol/:idcontrol', [mdAuth.verificaToken, mdAuth.canUpdate], FormsController.editControl);

module.exports = app;