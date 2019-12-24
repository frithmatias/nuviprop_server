var express = require("express");
var app = express();

// Controllers
var PropController = require("../controllers/propiedades.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Propiedades
app.get("/", PropController.getProps);
app.get("/all", [mdAuth.verificaToken, mdAuth.canUpdate], PropController.getPropsAll);
// Propiedad
app.get("/:id", PropController.getProp);
app.post("/", [mdAuth.verificaToken, mdAuth.canUpdate], PropController.createProp);
app.put('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], PropController.updateProp); //put o patch
app.delete('/:id', [mdAuth.verificaToken, mdAuth.canUpdate], PropController.deleteProp);
// Detalles
app.post('/detalles/:idprop', [mdAuth.verificaToken, mdAuth.canUpdate], PropController.createDetails);
app.put('/detalles/:id', [mdAuth.verificaToken, mdAuth.canUpdate], PropController.updateDetails); //put o patch

app.put('/changestatus/:id', [mdAuth.verificaToken, mdAuth.canUpdate], PropController.changeStatus); //put o patch


module.exports = app;
