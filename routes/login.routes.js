var express = require('express');
var app = express();

// Controllers
var LoginController = require('../controllers/login.controller');

// Middlewares 
var mdAuth = require('../middlewares/auth.middleware');

// Rutas en /login
app.get('/updatetoken', mdAuth.verificaToken, LoginController.updateToken);
app.post('/google', LoginController.loginGoogle);
app.post('/', LoginController.login);

//app.delete('/:id', mdAuth.verificaToken, UserController.deleteUser);
module.exports = app;