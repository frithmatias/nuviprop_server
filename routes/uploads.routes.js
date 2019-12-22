var express = require("express");
var app = express();

// Controllers
var UploadController = require("../controllers/uploads.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Rutas en /user
// app.get('/', UploadController.);
// app.post('/', mdAuth.verificaToken, PropController.createProp);
app.put("/:tipo/:id", [mdAuth.verificaToken], UploadController.uploadImagen); //put o patch
app.delete("/:tipo/:id/:filename", [mdAuth.verificaToken], UploadController.deleteImagen); //put o patch

// TODO: implementar el borrado de una imagen en particular, ej. /propiedades/id_prop/nombre_img
// app.delete('/:tipo/:id/:id', mdAuth.verificaToken, UploadController.deleteImagen); //put o patch
module.exports = app;
