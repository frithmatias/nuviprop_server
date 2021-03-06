var express = require("express");
var app = express();

// Controllers
var UserController = require("../controllers/usuarios.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Rutas en /usuarios
app.get("/", UserController.getUsers);
app.post("/", UserController.createUser);
app.get('/activate/:userid', UserController.activateUser);
app.get('/sendactivationmail/:userid', UserController.userRequestNewMail);
app.put('/addfavourite/:userid', mdAuth.verificaToken, UserController.addFavourite);

// Admin
app.put('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], UserController.updateUser); //put o patch
app.get('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], UserController.readUser);
app.delete('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], UserController.deleteUser);

module.exports = app;
