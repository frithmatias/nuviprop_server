var express = require('express');
var app = express();

// Controllers
var FormsController = require('../controllers/forms.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/:id', FormsController.getForm);

module.exports = app;