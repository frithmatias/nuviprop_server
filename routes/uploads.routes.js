var express = require("express");
var app = express();

// Controllers
var UploadController = require("../controllers/uploads.controller");

// Middlewares
var mdAuth = require("../middlewares/auth.middleware");

// Rutas en /user
// app.get('/', UploadController.);
app.put("/:tipo/:id", [mdAuth.verificaToken], UploadController.uploadImagen); //put o patch
app.delete("/:tipo/:id/:filename", [mdAuth.verificaToken], UploadController.deleteImagen); //put o patch
module.exports = app;
