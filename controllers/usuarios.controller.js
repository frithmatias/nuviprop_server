var bcrypt = require("bcryptjs");
var UserModel = require("../models/usuario.model");

// var mdAuth = require('../middlewares/autenticacion');

// RAIZ DE USUARIO
// http://localhost:3000/usuario

// ==================================================
// Obtener todos los usuarios
// ==================================================
function getUsers(req, res) {
  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/usuario?desde=10
  var desde = req.query.desde || 0;
  desde = Number(desde);

  //Usuario.find({}, 'nombre email img role')
  UserModel.find({}, "nombre email img role google")
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      // el segundo argumento es un callback (err, usuarios) =>

      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando usuario",
          errors: err
        });
      }

      UserModel.countDocuments({}, (err, cantidad) => {
        res.status(200).json({
          ok: true,
          mensaje: "Peticion GET de USUARIOS realizada correctamente.",
          usuarios: usuarios,
          total: cantidad
          // En standar ES6 no haría falta definir usuarios: usuarios porque es como redundante,
          // pero lo vamos a dejar así para que sea mas claro.
        });
      });
    });
}

// ==================================================
// Crear un nuevo usuario
// ==================================================

function createUser(req, res) {
  var body = req.body;
  var usuario = new UserModel({
    email: body.email,
    nombre: body.nombre,
    apellido: body.apellido,
    nacimiento: body.nacimiento,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });
  console.log('lado servidor', usuario);
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error guardando usuario",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    res.status(201).json({
      ok: true,
      mensaje: "Usuario guardado correctamente.",
      usuario: usuarioGuardado, // USUARIO A GUARDAR
      usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
    });
  });
}

function addFavourite(req, res) {

  var body = req.body;
  var id = req.params.userid;


  // Verifico que el id existe
  UserModel.findById(id, (err, usuario) => {
    if (err) {
      // Un findById no debería retorar NINGUN error, si no lo encuentra, retorna un usuario vacío
      // por lo tanto, si encuentra un error lo configuro como un error 500 'Internal Server Error'
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error al buscar un usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el usuario)
        ok: false,
        mensaje: "No existe un usuario con el id " + id,
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }
    console.log('IDAVISO ', body.avisoid);
    // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el usuario.
    if (usuario.favoritos.includes(body.avisoid)) {
      // si existe la borra
      usuario.favoritos = usuario.favoritos.filter(favorito => {
        return favorito != body.avisoid;
      });
    } else {
      // si no existe la crea
      usuario.favoritos.push(body.avisoid);
    }

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err
        });
      }

      // Esta instrucción es para que NO retorne el password. Ojo que NO ESTOY guardando la carita, porque
      // La instrucción de guardado esta arriba, sólo la estoy modificando el dato en el objeto que me devuelve
      // el callback para que no muestre la password. El proceso de guardado ya lo hizo con usuario.save().

      usuarioGuardado.password = ":)";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });

}
// ==================================================
// Actualizar un usuario
// ==================================================
// Debería primero, ademas de los nuevos datos, recibir el _id del usuario a actualizar
// localhost:3000/usuario/5c64cae77477e92d88e6219a

function updateUser(req, res) {
  var body = req.body;
  var id = req.params.id;

  // Verifico que el id existe
  UserModel.findById(id, (err, usuario) => {
    if (err) {
      // Un findById no debería retorar NINGUN error, si no lo encuentra, retorna un usuario vacío
      // por lo tanto, si encuentra un error lo configuro como un error 500 'Internal Server Error'
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error al buscar un usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el usuario)
        ok: false,
        mensaje: "No existe un usuario con el id " + id,
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }

    // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el usuario.
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err
        });
      }

      // Esta instrucción es para que NO retorne el password. Ojo que NO ESTOY guardando la carita, porque
      // La instrucción de guardado esta arriba, sólo la estoy modificando el dato en el objeto que me devuelve
      // el callback para que no muestre la password. El proceso de guardado ya lo hizo con usuario.save().

      usuarioGuardado.password = ":)";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
} //put o patch

// ==================================================
// Borrar un usuario
// ==================================================
function deleteUser(req, res) {
  console.log('borrando usuario:', req.params);
  var id = req.params.id;

  UserModel.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error borrando usuario",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error borrando usuario, el usuario solicitado NO existe.",
        errors: { message: "No existe el usuario que intenta borrar." } // Este objeto con los errores viene de mongoose
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Usuario borrado correctamente.",
      usuario: usuarioBorrado
    });
  });
}

module.exports = { getUsers, createUser, updateUser, deleteUser, addFavourite };
