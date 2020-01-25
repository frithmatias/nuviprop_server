var express = require("express");
var app = express();
var fileSystem = require("./filesystem.controller");
var UserModel = require("../models/usuario.model");
var AvisoModel = require("../models/aviso.model");
var InmoModel = require("../models/inmobiliaria.model");

var fs = require("fs");
var path = require("path");

function uploadImagen(req, res) {
  var tipo = req.params.tipo;
  var id = req.params.id;
  // tipos admitidos
  var tiposValidos = ["avisos", "usuarios", "inmobiliarias"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      // ERROR DE BASE DE DATOS
      ok: false,
      mensaje: "Error, tipo de coleccion no valida.",
      errors: {
        message: "Els colecciones validas solo son " + tiposValidos.join(", ")
      }
    });
  }

  // Si no se reciben archivos devuelve error
  // console.log("req:", req.files);

  if (!req.files) {
    return res.status(500).json({
      // ERROR DE BASE DE DATOS
      ok: false,
      mensaje: "Error no hay archivos para subir.",
      errors: { message: "No se recibieron archivos para subir." }
    });
  }

  // Obtener nombre del archivo
  var archivo = req.files.imagen; //'imagen' es el nombre dado en body>form-data en POSTMAN
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];
  // extensiones permitidas
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      // ERROR DE BASE DE DATOS
      ok: false,
      mensaje: "Error, extension no valida.",
      errors: {
        message:
          "Debe de subir un archivo con extension " +
          extensionesValidas.join(", ")
      }
    });
  }
  // si no existe la carpeta ej. /uploads/avisos/RtY78GhF24uItRe87ui, la crea
  // crearCarpeta(tipo, id);
  var path = `./uploads/${tipo}/${id}`;
  console.log('Creando carpeta: ', path);
  var result = fileSystem.createFolder(path);
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`; // Uso los backticks para hacer un template literal
  var path = `./uploads/${tipo}/${id}/${nombreArchivo}`;
  archivo.mv(path, err => {
    // segundo argumento es un callback, recibe un error (claro que SOLO si se recibe un error).
    if (err) {
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error, no se pudo mover el archivo.",
        errors: err
      });
    }
    // Ya tengo la imagen en uploads/usuario ahora
    // 1. borro la imagen vieja
    // 2. guardo el nombre en la bbdd
    grabarImagenBD(tipo, id, nombreArchivo, res);
  });
}

function grabarImagenBD(tipo, id, nombreArchivo, res) {
  //usuario 5c75c21b70933c1784cdc8db 5c75c21b70933c1784cdc8db-924.jpg ServerResponse {...}
  // console.log("data en subirportipo(): ", tipo, id, nombreArchivo);
  if (tipo === "usuarios") {
    UserModel.findById(id, (err, resUserModel) => {
      if (!resUserModel) {
        res.status(400).json({
          ok: false,
          mensaje: "Usuario no existe",
          errors: {
            message:
              "El usuario que intenta acutalizar NO existe en la coleccion usuario."
          }
        });
      }

      if (resUserModel.img == "") resUserModel.img = "no_existe";

      var pathViejo = `./uploads/usuarios/${id}/${resUserModel.img}`;
      var pathNuevo = `./uploads/usuarios/${id}/${nombreArchivo}`;

      //borro imagen vieja
      if (fs.existsSync(pathViejo)) {
        console.log("Borrando imagen", pathViejo);
        fs.unlinkSync(pathViejo);
      }

      // Modifico la imagen en el objeto del usuario y la guardo en la BD
      resUserModel.img = nombreArchivo;
      resUserModel.save((err, usuarioActualizado) => {
        console.log("Guardando imagen", pathNuevo);
        usuarioActualizado.password = ":)";
        res.status(200).json({
          ok: true,
          mensaje: "Imagen de usuario actualizada correctamente",
          usuario: usuarioActualizado
        });
      });
    });
  }

  if (tipo === "avisos") {
    console.log('buscando con id ', id)
    AvisoModel.findById(id, (err, resAvisoModel) => {
      if (!resAvisoModel) {
        return res.status(400).json({
          ok: false,
          mensaje: "El aviso no existe",
          errors: {
            message: "El aviso que intenta acutalizar NO existe."
          }
        });
      }

      // en usuario tengo el valor IMG donde se almacena la foto del usuario
      // en aviso, puedo tener muchas fotos, pero NO necesito borrarlas
      // al subir una nueva no tengo que borrar las anteriores, puedo comentar
      // las lineas para borrar la imagen anterior.
      // var pathViejo = `./uploads/usuario/${id}/${resAvisoModel.img}`;
      // var pathNuevo = `./uploads/usuario/${id}/${nombreArchivo}`;

      // Si ya existe una imagen subida por ese usuario, la borra.
      // if (fs.existsSync(pathViejo)) {
      //   //if(fs.statSync(pathViejo).isFile()){
      //   console.log("Borrando imagen", pathViejo);
      //   fs.unlinkSync(pathViejo);
      // }

      // console.log('resAvisoModel', resAvisoModel);
      if (typeof resAvisoModel.imgs === 'undefined') {
        resAvisoModel.imgs = [];
      }

      resAvisoModel.imgs.push(nombreArchivo);
      resAvisoModel.save((err, avisoActualizado) => {
        // console.log("Guardando imagen", pathNuevo);
        res.status(200).json({
          ok: true,
          mensaje: "Imagenes de la prpiedad actualizadas correctamente",
          aviso: avisoActualizado
        });
      });
    });
  }

  if (tipo === "inmobiliarias") {

    InmoModel.findById(id, (err, resInmoModel) => {
      if (!resInmoModel) {
        res.status(400).json({
          ok: false,
          mensaje: "El inmobiliaria no existe",
          errors: {
            message: "El inmobiliaria que intenta acutalizar NO existe."
          }
        });
      }

      if (resInmoModel.img == "") resInmoModel.img = "no_existe";

      var pathViejo = `./uploads/inmobiliarias/${id}/${resInmoModel.img}`;
      var pathNuevo = `./uploads/inmobiliarias/${id}/${nombreArchivo}`;

      //borro imagen vieja
      if (fs.existsSync(pathViejo)) {
        console.log("Borrando imagen", pathViejo);
        fs.unlinkSync(pathViejo);
      }
      // guardo el nombre de la imagen nueva en la bbdd
      resInmoModel.img = nombreArchivo;
      resInmoModel.save((err, inmoActualizada) => {
        // console.log("Guardando imagen", pathNuevo);
        res.status(200).json({
          ok: true,
          mensaje: "Imagen de la inmobiliaria actualizada correctamente",
          inmobiliaria: inmoActualizada
        });
      });
    });
  }
}

function deleteImagen(req, res) {
  // TODO: Implementar borrar una imagen en las aviso, tengo que quitar un item con el
  // id que me viene como parametro que es el nombre de la foto y quitarlo del array.
  var tipo = req.params.tipo;
  var id = req.params.id;
  var filename = req.params.filename;





  if (tipo === "avisos") {



    // ELIMINO LA IMAGEN DE LA BASE DE DATOS
    AvisoModel.findById(id, (err, resAvisoModel) => {

      if (!resAvisoModel) {
        res.status(400).json({
          ok: false,
          mensaje: "El aviso no existe",
          errors: {
            message: "El aviso que intenta acutalizar NO existe."
          }
        });
      }


      if (filename === 'todas') {

        // BORRAR TODAS LAS IMAGENES
        // ELIMINO TODA LA CARPETA
        var dirPath = `./uploads/${tipo}/${id}`;
        fileSystem.deleteFolder(dirPath)
        // ELIMINO EL ARRAY DE LA BD    
        resAvisoModel.imgs = [];

      } else {

        // BORRAR SOLO UNA IMAGEN 
        var filePath = `./uploads/${tipo}/${id}/${filename}`;
        // ELIMINO EL ARCHIVO FISICO DE LA CARPETA
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        // ELIMINO LA IMAGEN DEL ARRAY EN LA BD
        resAvisoModel.imgs = resAvisoModel.imgs.filter(archivo => {
          return archivo != filename;
        });
      }

      // vuelvo a guardar el objeto sin ese archivo
      resAvisoModel.save((err, avisoActualizado) => {
        // console.log("Guardando imagen", pathNuevo);
        res.status(200).json({
          ok: true,
          mensaje: "Se elimino de la BD la imagen: " + filename,
          aviso: avisoActualizado
        });
      });




    });
  }



}


module.exports = { uploadImagen, deleteImagen };
