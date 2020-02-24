var bcrypt = require("bcryptjs");
var UserModel = require("../models/usuario.model");
var nodemailer = require('nodemailer');
var MAILER_USER = require('../config/config').MAILER_USER;
var MAILER_PASS = require('../config/config').MAILER_PASS;
// var mdAuth = require('../middlewares/autenticacion');
// RAIZ DE USUARIO
// http://localhost:3000/usuarios

async function sendActivationMail(usermail, username, uid) {
  console.log('Enviando mail a ', username, usermail, uid);
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com.ar",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: MAILER_USER, // generated ethereal user
      pass: MAILER_PASS // generated ethereal password
    }
  });
  let info = await transporter.sendMail({
    from: '"🏡 NuviProp" registro@nuviprop.com', // sender address
    to: usermail, // list of receivers
    subject: `Bienvenido ${username} ✔`, // Subject line

    text: `Bienvenido ${username}, 

    Por favor para activar tu cuenta hacé click aquí.
    https://www.nuviprop.com/#/login/activate/${uid}`, // plain text body

    html: `<b>Bienvenido ${username}</b>, 

    Por favor para activar tu cuenta hacé click aquí.</br>
    <b><a href="https://www.nuviprop.com/#/login/activate/${uid}">ACTIVAR CUENTA</a></b>` // html body

  });
}

function userRequestNewMail(req, res){
  // En el alert que le avisa que debe verificar el mail, se adjunta un boton para reenviar, que envía 
  // al backend el UID.
  var id = req.params.userid;
  UserModel.findById(id, (err, usuario) => {
    if (err) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error al buscar el usuario",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el usuario con el id " + id,
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }

    if (usuario.activo) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario ya se encuentra activo",
        errors: { message: "El usuario ya se encuentra activo" }
      });
    }

    sendActivationMail(usuario.email, usuario.nombre, usuario._id);

    res.status(201).json({
      ok: true,
      mensaje: `Mail enviado nuevamente a ${usuario.email}`
    });
  });

}

function createUser(req, res) {

  var body = req.body;
  var usuario = new UserModel({
    email: body.email,
    nombre: body.nombre,
    apellido: body.apellido,
    nacimiento: body.nacimiento,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
    createdat: new Date()
  });

  //===================================
  // SAVE USER
  //===================================
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "El email que ingresa ya se encuentra registrado.",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    //===================================
    // SEND MAIL VALIDATOR
    //===================================
    sendActivationMail(usuarioGuardado.email, usuarioGuardado.nombre, usuarioGuardado._id);

    res.status(201).json({
      ok: true,
      mensaje: "Usuario guardado correctamente.",
      usuario: usuarioGuardado, // USUARIO A GUARDAR
      usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
    });
  });
}

function activateUser(req, res){
  var id = req.params.userid;

  UserModel.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el usuario con el id " + id,
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }

    if(usuario.activo) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el usuario)
        ok: false,
        mensaje: "El usuario ya esta activo",
        errors: { message: "El usuario que intenta activar ya se encuentra activo." }
      });
    }


    usuario.activo = true;

    // usuario.activo = true;

    usuario.save((err, usuarioActivado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al activar el usuario",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: 'El usuario se activo correctamente',
        usuario: usuarioActivado
      });
    });
  });
}

function readUser(req, res) {
  UserModel.findById(req.params.id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con el id " + id,
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }

    res.status(200).json({
      ok: true,
      usuario
    });

  });
}

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
}

function deleteUser(req, res) {
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

function getUsers(req, res) {
  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/usuario?desde=10
  var desde = req.query.desde || 0;
  desde = Number(desde);

  //Usuario.find({}, 'nombre email img role')
  UserModel.find({}, "nombre email img role google")
    .skip(desde)
    .limit(20)
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

module.exports = { createUser, activateUser, userRequestNewMail, readUser, updateUser, deleteUser, addFavourite, getUsers };
