var express = require("express");
var app = express();
var fileSystem = require("./filesystem.controller");
var UserModel = require("../models/usuario.model");
var AvisoModel = require("../models/aviso.model");
var InmoModel = require("../models/inmobiliaria.model");
// var ftp = require('ftp'); // heroku -> hostinger https://www.npmjs.com/package/ftp 
var ftp = require('basic-ftp'); // https://www.npmjs.com/package/basic-ftp
var fs = require("fs");
var path = require("path");
var FTP_HOST = require('../config/config').FTP_HOST;
var FTP_USER = require('../config/config').FTP_USER;
var FTP_PASS = require('../config/config').FTP_PASS;

// En synchostinger DB_CONSTR.IndexOf('localhost') > 0 para definir ambiente de desarrollo
var DB_CONSTR = require('../config/config').DB_CONSTR;



// front -> [HTTP] -> heroku
function uploadImagenOFF(req, res) {
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
        message: "Las colecciones validas solo son " + tiposValidos.join(", ")
      }
    });
  }

  // Si no se reciben archivos devuelve error
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
  fileSystem.createFolder(path);

  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`; // Uso los backticks para hacer un template literal
  path = `./uploads/${tipo}/${id}/${nombreArchivo}`;
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

// front -> [HTTP] -> heroku -> [FTP] -> hostinger
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
        message: "Las colecciones validas solo son " + tiposValidos.join(", ")
      }
    });
  }

  // Si no se reciben archivos devuelve error
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
  // si no existe la carpeta la crea
  var pathdir = `./uploads/${tipo}/${id}`;
  console.log('creando carpeta', pathdir);
  fileSystem.createFolder(pathdir);
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`; // Uso los backticks para hacer un template literal
  pathfile = `./uploads/${tipo}/${id}/${nombreArchivo}`;

  archivo.mv(pathfile, err => {
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


    // ================================================================
    // SYNC HOSTINGER FTP: envío las imagenes hacia hostinger por FTP
    // ================================================================
    syncHostinger(pathdir).then(() => console.log('subido ok')).catch(err => console.log(err));
  });

}

async function syncHostinger(pathdir) {

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false
    });

    await client.ensureDir(pathdir);
    await client.clearWorkingDir();
    await client.uploadFromDir(pathdir);
  }
  catch (err) {
    console.log(err);
  }
  client.close();

}

function grabarImagenBD(tipo, id, nombreArchivo, res) {
  //usuario 5c75c21b70933c1784cdc8db 5c75c21b70933c1784cdc8db-924.jpg ServerResponse {...}
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
        fs.unlinkSync(pathViejo);
      }

      // Modifico la imagen en el objeto del usuario y la guardo en la BD
      resUserModel.img = nombreArchivo;
      resUserModel.save((err, usuarioActualizado) => {
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
      //   fs.unlinkSync(pathViejo);
      // }

      if (typeof resAvisoModel.imgs === 'undefined') {
        resAvisoModel.imgs = [];
      }
      resAvisoModel.imgs.push(nombreArchivo);
      resAvisoModel.save((err, avisoActualizado) => {
        if (err) {
          return res.status(500).json({
            // ERROR DE BASE DE DATOS
            ok: false,
            mensaje: "Error, se pudo guardar en nuevo archivo en la DB.",
            errors: err
          });
        }
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
        fs.unlinkSync(pathViejo);
      }
      // guardo el nombre de la imagen nueva en la bbdd
      resInmoModel.img = nombreArchivo;
      resInmoModel.save((err, inmoActualizada) => {
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
  var tipo = req.params.tipo;
  var id = req.params.id;
  // Puede tomar el nombre del archivo o "TODAS" para elimnar todas las imagenes del aviso
  var filename = req.params.filename; 

  if (tipo === "avisos") {
    // ===================================================
    // BUSCO EL AVISO EN LA BASE DE DATOS
    // ===================================================
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

      // ===================================================
      // ELIMINO ARCHIVOS FÍSICOS EN STORAGE
      // ===================================================
      var dirPath = `./uploads/${tipo}/${id}`;
      if (filename === 'todas') {
     
        // ELIMINA TODAS LOS ARCHIVOS DE IMAGENES
        fileSystem.deleteFolder(dirPath)
        // ELIMINA TODOS LOS ELEMENTOS DEL ARRAY DE IMAGENES EN LA BD
        resAvisoModel.imgs = [];
     
      } else {
     
        // ELIMINA UN ARCHIVO DE IMAGEN
        var filePath = `./uploads/${tipo}/${id}/${filename}`;
        if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
        // ELIMINA EL ELEMENTO DE LA IMAGNEN EN EL ARRAY DE LA BD
        resAvisoModel.imgs = resAvisoModel.imgs.filter(archivo => {
          return archivo != filename;
        });

      }
      
      // ===================================================
      // SINCRONIZO STORAGE EN HOSTINGER
      // ===================================================
      // Si mi ambiente de producción es Heroku tengo que sincronizar mi storage en Hostinger
      syncHostinger(dirPath).then(() => console.log('eliminado ok')).catch(err => console.log(err));
      
      resAvisoModel.save((err, avisoActualizado) => {
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
