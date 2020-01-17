var AvisoModel = require("../models/aviso.model");
var DetailModel = require("../models/detalles.model");
var FileSystem = require("./filesystem.controller")


var fs = require("fs");
var path = require("path");
// http://localhost:3000/aviso

function getAvisosAll(req, res) {
  var pagina = req.query.pagina || 0;
  pagina = Number(pagina);
  var desde = pagina * 20;
  AvisoModel.find()
    .populate('tipooperacion')
    .populate('tipoinmueble')
    .populate('tipounidad')
    .populate('localidad')
    .skip(desde)
    .limit(20)
    .exec((err, avisos) => {
      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando aviso",
          errors: err
        });
      }
      AvisoModel.count({}, (err, cantidad) => {
        res.status(200).json({
          ok: true,
          mensaje: "Peticion GET de avisos realizada correctamente.",
          avisos: avisos,
          total: cantidad
        });
      });
    });
}

function getAvisosActive(req, res) {
  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/aviso?desde=10
  var pagina = req.query.pagina || 0;
  pagina = Number(pagina);
  var desde = pagina * 20;

  //Avisoiedad.find({a, 'nombre email img role')
  AvisoModel.find({ activo: true })
    .populate('tipooperacion')
    .populate('tipoinmueble')
    .populate('tipounidad')
    .populate('localidad')
    .skip(desde)
    .limit(20)
    .exec((err, avisos) => {
      // el segundo argumento es un callback (err, avisos) =>

      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando aviso",
          errors: err
        });
      }

      AvisoModel.count({ activo: true }, (err, cantidad) => {
        res.status(200).json({
          ok: true,
          mensaje: "Peticion GET de avisos realizada correctamente.",
          avisos: avisos,
          total: cantidad
          // En standar ES6 no haría falta definir avisos: avisos porque es como redundante,
          // pero lo vamos a dejar así para que sea mas claro.
        });
      });
    });
}

function getAviso(req, res) {

  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/aviso?desde=10
  var id = req.params.id || 0;

  //Avisoiedad.find({a, 'nombre email img role')
  AvisoModel.findById(id)
    .populate('tipooperacion')
    .populate('tipoinmueble')
    .populate('tipounidad')
    .populate('localidad')
    .populate('usuario', 'nombre img email')
    .populate('detalles')
    .exec((err, aviso) => {
      // el segundo argumento es un callback (err, avisos) =>

      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando aviso",
          errors: err
        });
      }
      if (!aviso) {
        return res.status(400).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "No existe la aviso con id " + id,
          errors: { message: 'No existe un hospital con ese ID' }
        });
      }


      res.status(200).json({
        ok: true,
        mensaje: "Peticion GET de avisos realizada correctamente.",
        aviso: aviso
        // En standar ES6 no haría falta definir avisos: avisos porque es como redundante,
        // pero lo vamos a dejar así para que sea mas claro.
      });

    });
}

function createAviso(req, res) {
  var body = req.body;

  var aviso = new AvisoModel({
    calle: body.calle,
    altura: body.altura,
    piso: body.piso,
    depto: body.depto,


    titulo: body.titulo,
    descripcion: body.descripcion,
    precio: body.precio,
    moneda: body.moneda,
    nopublicarprecio: body.nopublicarprecio,
    aptocredito: body.aptocredito,
    codigopostal: body.codigopostal,
    imgs: [],
    activo: false,

    // _id to populate
    tipoinmueble: body.tipoinmueble,
    tipounidad: body.tipounidad,
    tipooperacion: body.tipooperacion,
    localidad: body.localidad,
    usuario: req.usuario._id
  });

  aviso.save((err, avisoGuardada) => {
    if (err) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error guardando aviso",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    res.status(201).json({
      ok: true,
      mensaje: "Avisoiedad guardada correctamente.",
      aviso: avisoGuardada, // USUARIO A GUARDAR
      usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
    });
  });
}

function updateAviso(req, res) {
  var body = req.body;

  var id = req.params.id;

  // si vuelvo a guardar una aviso sin fotos evito el error body.imgs.split is not a function 
  // TODO: cambiar esto, leer los archivos dentro de la carpeta de la aviso y armar un array 
  body.imgs = '';



  // Verifico que el id existe
  AvisoModel.findById(id, (err, aviso) => {
    if (err) {
      // Un findById no debería retorar NINGUN error, si no lo encuentra, retorna un aviso vacío
      // por lo tanto, si encuentra un error lo configuro como un error 500 'Internal Server Error'
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error al buscar la aviso",
        errors: err
      });
    }

    if (!aviso) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el aviso)
        ok: false,
        mensaje: "No existe la aviso con el id " + id,
        errors: { message: "No existe aviso con el id solicitado" }
      });
    }

    console.log(body);
    // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el aviso.
    aviso.calle = body.calle;
    aviso.altura = body.altura;
    aviso.piso = body.piso;
    aviso.depto = body.depto;
    aviso.tipoinmueble = body.tipoinmueble;
    aviso.tipounidad = body.tipounidad;
    aviso.tipooperacion = body.tipooperacion;
    aviso.titulo = body.titulo;
    aviso.descripcion = body.descripcion;
    aviso.precio = body.precio;
    aviso.moneda = body.moneda;
    aviso.nopublicarprecio = body.nopublicarprecio;
    aviso.aptocredito = body.aptocredito;
    aviso.provincia = body.provincia;
    aviso.departamento = body.departamento;
    aviso.localidad = body.localidad;
    aviso.coords = body.coords;
    aviso.codigopostal = body.codigopostal;
    aviso.usuario = req.usuario._id,
      // aviso.inmobiliaria = body.inmobiliaria;
      aviso.save((err, avisoGuardada) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar el aviso",
            errors: err
          });
        }

        // Esta instrucción es para que NO retorne el password. Ojo que NO ESTOY guardando la carita, porque
        // La instrucción de guardado esta arriba, sólo la estoy modificando el dato en el objeto que me devuelve
        // el callback para que no muestre la password. El proceso de guardado ya lo hizo con aviso.save().

        avisoGuardada.password = ":)";

        res.status(200).json({
          ok: true,
          aviso: avisoGuardada
        });
      });
  });
}

function pausedAviso(req, res) {
  var body = req.body;
  var id = req.params.id;

  AvisoModel.findById(id, (err, aviso) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar la aviso",
        errors: err
      });
    }

    if (!aviso) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el aviso)
        ok: false,
        mensaje: "No existe la aviso con el id " + id,
        errors: { message: "No existe aviso con el id solicitado" }
      });
    }

    (aviso.activo) ? aviso.activo = false : aviso.activo = true;

    // aviso.activo = true;

    aviso.save((err, avisoActivada) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al activar la aviso",
          errors: err
        });
      }

      // Esta instrucción es para que NO retorne el password. Ojo que NO ESTOY guardando la carita, porque
      // La instrucción de guardado esta arriba, sólo la estoy modificando el dato en el objeto que me devuelve
      // el callback para que no muestre la password. El proceso de guardado ya lo hizo con aviso.save().
      var msg = '';
      avisoActivada.activo ? msg = 'activo' : msg = 'desactivo';
      res.status(200).json({
        ok: true,
        mensaje: 'La aviso se ' + msg + ' correctamente',
        aviso: avisoActivada
      });
    });
  });
}

function deleteAviso(req, res) {
  var id = req.params.id;

  AvisoModel.findByIdAndRemove(id, (err, avisoBorrado) => {
    if (err) {
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error borrando aviso",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    if (!avisoBorrado) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error borrando aviso, el aviso solicitado NO existe.",
        errors: { message: "No existe el aviso que intenta borrar." } // Este objeto con los errores viene de mongoose
      });
    }

    // borro la aviso de la base de datos correctamente, ahora vamos a borrar los archivos subidos.
    var path = `./uploads/avisos/${id}`;
    console.log('enviando a borrar: ', path);
    var result = FileSystem.deleteFolder(path);
    console.log(result);


    res.status(200).json({
      ok: true,
      mensaje: "Avisoiedad borrada correctamente.",
      aviso: avisoBorrado
    });
  });
}

function createDetails(req, res) {
  var body = req.body;
  var idaviso = req.params.idaviso;

  AvisoModel.findById(idaviso)
    .exec((err, resAvisoModel) => {

      if (!resAvisoModel) {
        return res.status(400).json({
          ok: false,
          mensaje: "La aviso no existe!",
          errors: {
            message: "La aviso que intenta acutalizar NO existe."
          }
        });
      }

      if (resAvisoModel.detalles) {
        return res.status(400).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "La aviso para el POST ya tiene detalles relacionados!",
          errors: err // Este objeto con los errores viene de mongoose
        });
      }


      var detalles = new DetailModel({
        superficietotal: body.superficietotal,
        superficieconstruible: body.superficieconstruible,
        zonificacion: body.zonificacion,
        longitudfondo: body.longitudfondo,
        longitudfrente: body.longitudfrente,
        tipoterreno: body.tipoterreno,
        fot: body.fot,
        fos: body.fos,
        tipopendiente: body.tipopendiente,
        tipovista: body.tipovista,
        tipocosta: body.tipocosta,
        estado: body.estado,
        propiedadocupada: body.propiedadocupada,
        fondoirregular: body.fondoirregular,
        frenteirregular: body.frenteirregular,
        demolicion: body.demolicion,
        lateralizquierdoirregular: body.lateralizquierdoirregular,
        lateralderechoirregular: body.lateralderechoirregular,
        instalaciones: body.instalaciones,
        servicios: body.servicios
      });

      detalles.save((err, detallesGuardados) => {

        if (err) {
          return res.status(400).json({
            // ERROR DE BASE DE DATOS
            ok: false,
            mensaje: "Error guardando detalles",
            errors: err // Este objeto con los errores viene de mongoose
          });
        }

        resAvisoModel.detalles = detallesGuardados._id;
        req.usuario.password = ';)';

        resAvisoModel.save((err, resAvisoActualizada) => {
          res.status(200).json({
            ok: true,
            mensaje: "El id del detalle fue ingresado correctamente en el documento de la aviso.",
            detalles: detallesGuardados,
            aviso: resAvisoActualizada,
            usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
          });
        });

      });
    });
}

function updateDetails(req, res) {
  var body = req.body;
  var id = req.params.id;

  AvisoModel.findById(id, (err, aviso) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar la aviso",
        errors: err
      });
    }

    if (!aviso) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el aviso)
        ok: false,
        mensaje: "No existe la aviso con el id " + id,
        errors: { message: "No existe la aviso con el id solicitado" }
      });
    }

    DetailModel.findById(aviso.detalles, (err, detalles) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar los detalles",
          errors: err
        });
      }
      if (!detalles) {
        return res.status(400).json({
          // Podría ser 400, Bad request (no encontro el aviso)
          ok: false,
          mensaje: "No existen detalles para la aviso con el id " + id,
          errors: { message: "No existen detalles con el id solicitado" }
        });
      }
      // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el aviso.
      detalles.superficietotal = body.superficietotal;
      detalles.superficieconstruible = body.superficieconstruible;
      detalles.zonificacion = body.zonificacion;
      detalles.longitudfondo = body.longitudfondo;
      detalles.longitudfrente = body.longitudfrente;
      detalles.tipoterreno = body.tipoterreno;
      detalles.fot = body.fot;
      detalles.fos = body.fos;
      detalles.tipopendiente = body.tipopendiente;
      detalles.tipovista = body.tipovista;
      detalles.tipocosta = body.tipocosta;
      detalles.estado = body.estado;
      detalles.avisoocupada = body.avisoocupada;
      detalles.fondoirregular = body.fondoirregular;
      detalles.frenteirregular = body.frenteirregular;
      detalles.demolicion = body.demolicion;
      detalles.lateralizquierdoirregular = body.lateralizquierdoirregular;
      detalles.lateralderechoirregular = body.lateralderechoirregular;
      detalles.instalaciones = body.instalaciones;
      detalles.servicios = body.servicios;

      // aviso.inmobiliaria = body.inmobiliaria;
      detalles.save((err, detallesGuardados) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar los detalles",
            errors: err
          });
        }

        res.status(200).json({
          ok: true,
          mensaje: 'El detalle para la aviso solcitada fue actualizado correctamente.',
          detalles: detallesGuardados
        });
      });
    });
  })



  // Verifico que el id existe

}



module.exports = {
  getAvisosAll,
  getAvisosActive,
  getAviso,
  createAviso,
  updateAviso,
  deleteAviso,
  pausedAviso,
  createDetails,
  updateDetails
};