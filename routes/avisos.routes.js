var express = require("express");
var app = express();

// Controllers
var avisoController = require("../controllers/avisos.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Avisos
app.get("/", avisoController.getAvisosActive);
app.get("/misfavoritos", [mdAuth.verificaToken], avisoController.getMisFavoritos);
app.get("/misavisos/:uid", [mdAuth.verificaToken], avisoController.getMisAvisos);
app.get('/:operacion?/:inmueble?/:localidad/:pagina', avisoController.getAvisosCriteria);
// Aviso
app.get("/:id", avisoController.getAviso);
app.post("/", [mdAuth.verificaToken], avisoController.createAviso);
app.put('/:id', [mdAuth.verificaToken], avisoController.updateAviso);
app.delete('/:id', [mdAuth.verificaToken], avisoController.deleteAviso);
// Detalles
app.post('/detalles/:idaviso', [mdAuth.verificaToken], avisoController.createDetails);
app.put('/detalles/:idaviso', [mdAuth.verificaToken], avisoController.updateDetails);
app.put('/pause/:id', [mdAuth.verificaToken], avisoController.pausedAviso);
app.put('/destacar/:id', [mdAuth.verificaToken], avisoController.destacarAviso);

module.exports = app;
