var AvisoModel = require("../models/aviso.model");
var DetailModel = require("../models/detalles.model");
var FileSystem = require("./filesystem.controller")


var fs = require("fs");
var path = require("path");
// http://localhost:3000/aviso

function getAvisosCriteria(req, res) {

  // http://localhost:3000
  //     /avisos
  //     /5e04b4bd3cb7d5a2401c9895-5e04b4ce3cb7d5a2401c98a5
  //     /5e04bf7a3cb7d5a2401c9b15-5e04bfa73cb7d5a2401c9b30-5e04bfb93cb7d5a2401c9b38-5e04bfbf3cb7d5a2401c9b3e-5e04bfc53cb7d5a2401c9b45
  //     /5df2eb5664b1fc02b5e1fdef
  //     /0

  // REQ.BODY -> lo que viene en el body puede ser un objeto 
  // REQ.PARAMS -> lo que viene como parámetros en la URL (aviso/5e0826513392d12ca077e925)
  // REQ.QUERY -> lo que viene como argumentos en la URL (&nombre=diego&edad=40)

  // TIPO DE OPERACION
  var operacion = req.params.operacion;
  var operaciones = operacion.split('-');

  // TIPO DE INMUEBLE
  var inmueble = req.params.inmueble;
  var inmuebles = inmueble.split('-');

  // LOCALIDAD 
  var localidad = req.params.localidad;
  //localidad = localidad.replace(/_/g, ' ');
  var localidades = localidad.split('-');

  var pagina = req.params.pagina || 0;
  pagina = Number(pagina);
  var desde = pagina * 20;
  var query = {};

  if ((operacion === 'undefined') || (inmueble === 'undefined') || (localidades === 'undefined')) {
    return res.status(400).json({
      // ERROR DE BASE DE DATOS
      ok: false,
      mensaje: "No se indica tipo de operación o el tipo de inmueble."
    });
  }

  //Aviso.find({a, 'nombre email img role')
  AvisoModel.aggregate([
    // Convierto los ObjectId("5e04b4bd3cb7d5a2401c9895")}) a String "5e04b4bd3cb7d5a2401c9895"
    // La función inversa es $toObjectId -> {$toObjectId: "5ab9cbfa31c2ab715d42129e"}
    {$addFields: {
        "localidad_id": { $toString: "$localidad" },
        "tipoinmueble_id": { $toString: "$tipoinmueble" },
        "tipooperacion_id": { $toString: "$tipooperacion" }
    }},
    
    {$match: {
        $and: [
          { "tipooperacion_id": { $in: operaciones } },
          { "tipoinmueble_id": { $in: inmuebles } },
          { "localidad_id": { $in: localidades } }
        ]
    }},

    // para obtener un sólo elemento dentro de un array
    // {$project: { 
    //       "localidad": { "$arrayElemAt": [ "$localidad", 0 ] }            
    // }},

    
    {$lookup: { from: 'localidades', localField: 'localidad', foreignField: '_id', as: 'localidad' }},
    {$lookup: { from: 'avisos_tipooperacion', localField: 'tipooperacion', foreignField: '_id', as: 'tipooperacion' }},
    {$lookup: { from: 'avisos_tipoinmueble', localField: 'tipoinmueble', foreignField: '_id', as: 'tipoinmueble' }},
    {$lookup: { from: 'avisos_tipocambio', localField: 'tipocambio', foreignField: '_id', as: 'tipocambio' }},

    // Los campos relacionados con lookup (join) obtienen un array del objeto deseado, para hacer un deconstruct uso unwind. 
    {$unwind: "$localidad" },
    {$unwind: "$tipooperacion" },
    {$unwind: "$tipoinmueble" },
    {$unwind: "$tipocambio" }
  ])
    .skip(desde)
    .limit(20)
    .exec((err, avisos) => {
      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando avisos",
          errors: err
        });
      }
      // el segundo argumento es un callback (err, avisos) =>


        res.status(200).json({
          ok: true,
          mensaje: "Peticion GET de avisos realizada correctamente.",
          avisos: avisos,
          total: avisos.length
          // En standar ES6 no haría falta definir avisos: avisos porque es como redundante,
          // pero lo vamos a dejar así para que sea mas claro.
        });

    });
}

function getMisAvisos(req, res) {
  var pagina = req.query.pagina || 0;
  var uid = req.params.uid;
  pagina = Number(pagina);
  var desde = pagina * 20;
  AvisoModel.find({ 'usuario': uid })
    .populate('tipooperacion')
    .populate('tipoinmueble')
    .populate('tipounidad')
    .populate('tipocambio')
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

function getMisFavoritos(req, res){
  // ?pagina=n
  var pagina = req.query.pagina || 0;
  pagina = Number(pagina);
  var desde = pagina * 20;
  
  // &avisos=[]
  var avisos = req.query.avisos || '';
  var arrAvisos = avisos.split(',');
 
  AvisoModel.find({ '_id': { $in: arrAvisos } })
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
    calle:  body.calle,
    altura:  body.altura,
    piso:  body.piso,
    depto:  body.depto,
    titulo:  body.titulo,
    descripcion:  body.descripcion,
    precio:  body.precio,
    tipocambio:  body.tipocambio,
    publicarprecio:  body.publicarprecio,
    aptocredito:  body.aptocredito,
    codigopostal:  body.codigopostal,
    activo: false,
    destacado: false,

    tipooperacion:  body.tipooperacion,
    tipoinmueble:  body.tipoinmueble,
    tipounidad:  body.tipounidad,
    localidad:  body.localidad,
    coords:  {'lat': body.lat, 'lng': body.lng},
    usuario:  req.usuario._id,

    imgs: [],
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

    // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el aviso.
    aviso.calle = body.calle;
    aviso.altura = body.altura;
    aviso.piso = body.piso;
    aviso.depto = body.depto;
    aviso.titulo = body.titulo;
    aviso.descripcion = body.descripcion;
    aviso.precio = body.precio;
    aviso.tipocambio = body.tipocambio;
    aviso.publicarprecio = body.publicarprecio;
    aviso.aptocredito = body.aptocredito;
    aviso.codigopostal = body.codigopostal;
    aviso.tipooperacion = body.tipooperacion;
    // activo y destacado no son datos actualizables
    aviso.tipoinmueble = body.tipoinmueble;
    aviso.tipounidad = body.tipounidad;
    aviso.localidad = body.localidad;
    aviso.coords = {'lat': body.lat, 'lng': body.lng};
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

function destacarAviso(req, res) {
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

    (aviso.destacado) ? aviso.destacado = false : aviso.destacado = true;

    // aviso.activo = true;

    aviso.save((err, avisoDestacado) => {
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
      avisoDestacado.destacado ? msg = '' : msg = 'NO';
      res.status(200).json({
        ok: true,
        mensaje: 'Aviso ' + msg + ' destacado.',
        aviso: avisoDestacado
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
    var result = FileSystem.deleteFolder(path);

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

        orientacion: body.orientacion,
        superficiecubierta: body.superficiecubierta,
        superficiedescubierta: body.superficiedescubierta,
        superficiedelterreno: body.superficiedelterreno,
        cantidaddedormitorios: body.cantidaddedormitorios,
        cantidaddebanios: body.cantidaddebanios,
        cantidaddetoilettes: body.cantidaddetoilettes,
        cantidaddecocheras: body.cantidaddecocheras,
        cantidaddeplantas: body.cantidaddeplantas,
        cantidaddeambientes: body.cantidaddeambientes,
        antiguedad: body.antiguedad,
        longitudfrente: body.longitudfrente,
        longitudfondo: body.longitudfondo,
        tipotecho: body.tipotecho,
        tipopendiente: body.tipopendiente,
        tipovista: body.tipovista,
        tipocosta: body.tipocosta,
        tipopiso: body.tipopiso,
        estado: body.estado,
        ambientes: body.ambientes,
        instalaciones: body.instalaciones,
        servicios: body.servicios,
        expensas: body.expensas,
        tipoexpensas: body.tipoexpensas,
        disposicion: body.disposicion,
        tipocochera: body.tipocochera,
        tipocoberturacochera: body.tipocoberturacochera,
        tipobalcon: body.tipobalcon,
        tipoterreno: body.tipoterreno
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
  var id = req.params.idaviso;

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
      detalles.orientacion = body.orientacion;
      detalles.superficiecubierta = body.superficiecubierta;
      detalles.superficiedescubierta = body.superficiedescubierta;
      detalles.superficiedelterreno = body.superficiedelterreno;
      detalles.cantidaddedormitorios = body.cantidaddedormitorios;
      detalles.cantidaddebanios = body.cantidaddebanios;
      detalles.cantidaddetoilettes = body.cantidaddetoilettes;
      detalles.cantidaddecocheras = body.cantidaddecocheras;
      detalles.cantidaddeplantas = body.cantidaddeplantas;
      detalles.cantidaddeambientes = body.cantidaddeambientes;
      detalles.antiguedad = body.antiguedad;
      detalles.longitudfrente = body.longitudfrente;
      detalles.longitudfondo = body.longitudfondo;
      detalles.tipotecho = body.tipotecho;
      detalles.tipopendiente = body.tipopendiente;
      detalles.tipovista = body.tipovista;
      detalles.tipocosta = body.tipocosta;
      detalles.tipopiso = body.tipopiso;
      detalles.estado = body.estado;
      detalles.ambientes = body.ambientes;
      detalles.instalaciones = body.instalaciones;
      detalles.servicios = body.servicios;
      detalles.expensas = body.expensas;
      detalles.tipoexpensas = body.tipoexpensas;
      detalles.disposicion = body.disposicion;
      detalles.tipocochera = body.tipocochera;
      detalles.tipocoberturacochera = body.tipocoberturacochera;
      detalles.tipobalcon = body.tipobalcon;
      detalles.tipoterreno = body.tipoterreno;


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
  getAvisosCriteria,
  getMisAvisos,
  getMisFavoritos,
  getAvisosActive,
  getAviso,
  createAviso,
  updateAviso,
  deleteAviso,
  pausedAviso,
  destacarAviso,
  createDetails,
  updateDetails
};
