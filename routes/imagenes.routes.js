var express = require('express');
var app = express();

// Controllers
var ImageController = require('../controllers/imagenes.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas
app.get('/:tipo/:id/:img', ImageController.getImage);

module.exports = app;