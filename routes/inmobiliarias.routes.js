var express = require("express");
var app = express();

// Controllers
var inmobController = require("../controllers/inmobiliarias.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Rutas en /user
app.get("/", inmobController.getInmobs);
app.get("/:id", inmobController.getInmob);
app.post("/", [mdAuth.verificaToken, mdAuth.canUpdate], inmobController.createInmob);
app.put('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], inmobController.updateInmob); //put o patch
app.delete('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], inmobController.deleteInmob);
module.exports = app;
