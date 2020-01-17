var express = require("express");
var app = express();

// Controllers
var avisoController = require("../controllers/avisos.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Avisos
app.get("/", avisoController.getAvisosActive);
app.get("/all", [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.getAvisosAll);
// Avisoiedad
app.get("/:id", avisoController.getAviso);
app.post("/", [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.createAviso);
app.put('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.updateAviso); //put o patch
app.delete('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.deleteAviso);
// Detalles
app.post('/detalles/:idaviso', [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.createDetails);
app.put('/detalles/:id', [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.updateDetails); //put o patch
app.put('/pause/:id', [mdAuth.verificaToken, mdAuth.canUpdate], avisoController.pausedAviso); //put o patch

module.exports = app;
