var express = require("express");
var app = express();

var UserModel = require("../models/user.model");
var PropModel = require("../models/propiedad.model");

var fs = require("fs");
var path = require("path");

function uploadImagen(req, res) {
  var tipo = req.params.tipo; //si es hospital, medico o usuario
  var id = req.params.id;
  console.log("DATA:", req.params);
  // tipos admitidos
  var tiposValidos = ["propiedades", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      // ERROR DE BASE DE DATOS
      ok: false,
      mensaje: "Error, tipo de coleccion no valida.",
      errors: {
        message: "Las colecciones validas solo son " + tiposValidos.join(", ")
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
  console.log('extension: ', extensionArchivo);
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
  // si no existe la carpeta ej. /uploads/propiedades/RtY78GhF24uItRe87ui, la crea
  crearCarpeta(tipo, id);

  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`; // Uso los backticks para hacer un template literal
  var path = `./uploads/${tipo}/${id}/${nombreArchivo}`;
  console.log('path: ', path);
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

      // guardo el nombre de la imagen nueva en la bbdd
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

  if (tipo === "propiedades") {
    PropModel.findById(id, (err, resPropModel) => {
      if (!resPropModel) {
        res.status(400).json({
          ok: false,
          mensaje: "La propiedad no existe",
          errors: {
            message: "La propiedad que intenta acutalizar NO existe."
          }
        });
      }

      // en usuario tengo el valor IMG donde se almacena la foto del usuario
      // en propiedad, puedo tener muchas fotos, pero NO necesito borrarlas
      // al subir una nueva no tengo que borrar las anteriores, puedo comentar
      // las lineas para borrar la imagen anterior.
      // var pathViejo = `./uploads/usuario/${id}/${resPropModel.img}`;
      // var pathNuevo = `./uploads/usuario/${id}/${nombreArchivo}`;

      // Si ya existe una imagen subida por ese usuario, la borra.
      // if (fs.existsSync(pathViejo)) {
      //   //if(fs.statSync(pathViejo).isFile()){
      //   console.log("Borrando imagen", pathViejo);
      //   fs.unlinkSync(pathViejo);
      // }

      resPropModel.imgs.push(nombreArchivo);
      resPropModel.save((err, propActualizada) => {
        // console.log("Guardando imagen", pathNuevo);
        res.status(200).json({
          ok: true,
          mensaje: "Imagenes de la prpiedad actualizadas correctamente",
          propiedad: propActualizada
        });
      });
    });
  }


}

function deleteImagen() {
  // TODO: Implementar borrar una imagen en las propiedad, tengo que quitar un item con el
  // id que me viene como parametro que es el nombre de la foto y quitarlo del array.
}

function crearCarpeta(tipo, id) {
  // ./uploads/propiedad
  // ./uploads/usuario
  var pathUser = path.resolve(__dirname, "../uploads", tipo, id);
  var existe = fs.existsSync(pathUser);
  if (!existe) {
    fs.mkdirSync(pathUser);
  }
  // return pathUserTemp;
}

module.exports = { uploadImagen };
