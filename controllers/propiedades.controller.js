var PropModel = require("../models/propiedad.model");
var DetailModel = require("../models/detalles.model");

// http://localhost:3000/propiedad

function getPropsAll(req, res) {
  var pagina = req.query.pagina || 0;
  pagina = Number(pagina);
  var desde = pagina * 20;
  PropModel.find()
    .skip(desde)
    .limit(20)
    .exec((err, propiedades) => {
      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando propiedad",
          errors: err
        });
      }
      PropModel.count({}, (err, cantidad) => {
        res.status(200).json({
          ok: true,
          mensaje: "Peticion GET de PROPIEDADES realizada correctamente.",
          propiedades: propiedades,
          total: cantidad
        });
      });
    });
}

function getProps(req, res) {
  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/propiedad?desde=10
  var pagina = req.query.pagina || 0;
  pagina = Number(pagina);
  var desde = pagina * 20;

  //Propiedad.find({a, 'nombre email img role')
  PropModel.find({ activo: true })
    .skip(desde)
    .limit(20)
    .exec((err, propiedades) => {
      // el segundo argumento es un callback (err, propiedads) =>

      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando propiedad",
          errors: err
        });
      }

      PropModel.count({ activo: true }, (err, cantidad) => {
        res.status(200).json({
          ok: true,
          mensaje: "Peticion GET de PROPIEDADES realizada correctamente.",
          propiedades: propiedades,
          total: cantidad
          // En standar ES6 no haría falta definir propiedads: propiedads porque es como redundante,
          // pero lo vamos a dejar así para que sea mas claro.
        });
      });
    });
}

function getProp(req, res) {

  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/propiedad?desde=10
  var id = req.params.id || 0;

  //Propiedad.find({a, 'nombre email img role')
  PropModel.findById(id)
    .populate('usuario', 'nombre img email')
    .populate('inmobiliaria')
    .populate('detalles')
    .exec((err, propiedad) => {
      // el segundo argumento es un callback (err, propiedads) =>

      if (err) {
        return res.status(500).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "Error cargando propiedad",
          errors: err
        });
      }
      if (!propiedad) {
        return res.status(400).json({
          // ERROR DE BASE DE DATOS
          ok: false,
          mensaje: "No existe la propiedad con id " + id,
          errors: { message: 'No existe un hospital con ese ID' }
        });
      }


      res.status(200).json({
        ok: true,
        mensaje: "Peticion GET de PROPIEDADES realizada correctamente.",
        propiedad: propiedad
        // En standar ES6 no haría falta definir propiedads: propiedads porque es como redundante,
        // pero lo vamos a dejar así para que sea mas claro.
      });

    });
}

function createProp(req, res) {
  var body = req.body;

  var propiedad = new PropModel({
    calle: body.calle,
    altura: body.altura,
    piso: body.piso,
    depto: body.depto,
    tipoinmueble: body.tipoinmueble,
    tipounidad: body.tipounidad,
    tipooperacion: body.tipooperacion,
    titulo: body.titulo,
    descripcion: body.descripcion,
    precio: body.precio,
    moneda: body.moneda,
    nopublicarprecio: body.nopublicarprecio,
    aptocredito: body.aptocredito,
    pais: body.pais,
    provincia: body.provincia,
    partido: body.partido,
    localidad: body.localidad,
    barrio: body.barrio,
    subbarrio: body.subbarrio,
    codigopostal: body.codigopostal,
    imgs: [],
    activo: false,
    usuario: req.usuario._id
    // inmobiliaria: body.inmobiliaria,
  });

  propiedad.save((err, propiedadGuardada) => {
    if (err) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error guardando propiedad",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    res.status(201).json({
      ok: true,
      mensaje: "Propiedad guardada correctamente.",
      propiedad: propiedadGuardada, // USUARIO A GUARDAR
      usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
    });
  });
}

function updateProp(req, res) {
  var body = req.body;

  var id = req.params.id;

  // si vuelvo a guardar una propiedad sin fotos evito el error body.imgs.split is not a function 
  // TODO: cambiar esto, leer los archivos dentro de la carpeta de la propiedad y armar un array 
  body.imgs = '';



  // Verifico que el id existe
  PropModel.findById(id, (err, propiedad) => {
    if (err) {
      // Un findById no debería retorar NINGUN error, si no lo encuentra, retorna un propiedad vacío
      // por lo tanto, si encuentra un error lo configuro como un error 500 'Internal Server Error'
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error al buscar la propiedad",
        errors: err
      });
    }

    if (!propiedad) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el propiedad)
        ok: false,
        mensaje: "No existe la propiedad con el id " + id,
        errors: { message: "No existe propiedad con el id solicitado" }
      });
    }

    console.log(body);
    // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el propiedad.
    propiedad.calle = body.calle;
    propiedad.altura = body.altura;
    propiedad.piso = body.piso;
    propiedad.depto = body.depto;
    propiedad.tipoinmueble = body.tipoinmueble;
    propiedad.tipounidad = body.tipounidad;
    propiedad.tipooperacion = body.tipooperacion;
    propiedad.titulo = body.titulo;
    propiedad.descripcion = body.descripcion;
    propiedad.precio = body.precio;
    propiedad.moneda = body.moneda;
    propiedad.nopublicarprecio = body.nopublicarprecio;
    propiedad.aptocredito = body.aptocredito;
    propiedad.pais = body.pais;
    propiedad.provincia = body.provincia;
    propiedad.partido = body.partido;
    propiedad.localidad = body.localidad;
    propiedad.barrio = body.barrio;
    propiedad.subbarrio = body.subbarrio;
    propiedad.codigopostal = body.codigopostal;
    propiedad.usuario = req.usuario._id,
      // propiedad.inmobiliaria = body.inmobiliaria;
      propiedad.save((err, propiedadGuardada) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar el propiedad",
            errors: err
          });
        }

        // Esta instrucción es para que NO retorne el password. Ojo que NO ESTOY guardando la carita, porque
        // La instrucción de guardado esta arriba, sólo la estoy modificando el dato en el objeto que me devuelve
        // el callback para que no muestre la password. El proceso de guardado ya lo hizo con propiedad.save().

        propiedadGuardada.password = ":)";

        res.status(200).json({
          ok: true,
          propiedad: propiedadGuardada
        });
      });
  });
} //put o patch



function createDetails(req, res) {
  var body = req.body;
  var idprop = req.params.idprop;



  PropModel.findById(idprop, (err, resPropModel) => {

    if (!resPropModel) {
      return res.status(400).json({
        ok: false,
        mensaje: "La propiedad no existe!",
        errors: {
          message: "La propiedad que intenta acutalizar NO existe."
        }
      });
    }

    if (resPropModel.detalles) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "La propiedad para el POST ya tiene detalles relacionados!",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }


    var detalles = new DetailModel({
      terraza: body.terraza
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

      resPropModel.detalles = detallesGuardados._id;
      req.usuario.password = ';)';

      resPropModel.save((err, resPropActualizada) => {
        res.status(200).json({
          ok: true,
          mensaje: "El id del detalle fue ingresado correctamente en el documento de la propiedad.",
          detalles: detallesGuardados,
          propiedad: resPropActualizada,
          usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
        });
      });

    });
  });
}



function updateDetails(req, res) {
  var body = req.body;
  var id = req.params.id;

  PropModel.findById(id, (err, propiedad) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar la propiedad",
        errors: err
      });
    }

    if (!propiedad) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el propiedad)
        ok: false,
        mensaje: "No existe la propiedad con el id " + id,
        errors: { message: "No existe la propiedad con el id solicitado" }
      });
    }

    DetailModel.findById(propiedad.detalles, (err, detalles) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar los detalles",
          errors: err
        });
      }
      if (!detalles) {
        return res.status(400).json({
          // Podría ser 400, Bad request (no encontro el propiedad)
          ok: false,
          mensaje: "No existen detalles para la propiedad con el id " + id,
          errors: { message: "No existen detalles con el id solicitado" }
        });
      }
      // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el propiedad.
      detalles.terraza = body.terraza;
      // propiedad.inmobiliaria = body.inmobiliaria;
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
          mensaje: 'El detalle para la propiedad solcitada fue actualizado correctamente.',
          detalles: detallesGuardados
        });
      });
    });
  })



  // Verifico que el id existe

} //put o patch

function changeStatus(req, res) {
  var body = req.body;
  var id = req.params.id;

  PropModel.findById(id, (err, propiedad) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar la propiedad",
        errors: err
      });
    }

    if (!propiedad) {
      return res.status(400).json({
        // Podría ser 400, Bad request (no encontro el propiedad)
        ok: false,
        mensaje: "No existe la propiedad con el id " + id,
        errors: { message: "No existe propiedad con el id solicitado" }
      });
    }

    console.log('estado anterior ', propiedad.activo);
    (propiedad.activo) ? propiedad.activo = false : propiedad.activo = true;
    console.log('estado despues ', propiedad.activo);

    // propiedad.activo = true;

    propiedad.save((err, propiedadActivada) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al activar la propiedad",
          errors: err
        });
      }

      // Esta instrucción es para que NO retorne el password. Ojo que NO ESTOY guardando la carita, porque
      // La instrucción de guardado esta arriba, sólo la estoy modificando el dato en el objeto que me devuelve
      // el callback para que no muestre la password. El proceso de guardado ya lo hizo con propiedad.save().

      res.status(200).json({
        ok: true,
        mensaje: 'La propiedad se activo correctamente',
        propiedad: propiedadActivada
      });
    });
  });
} //put o patch


function pauseProp(req, res) {
  //TODO, implementar pausar una propiedad
}

function deleteProp(req, res) {
  var id = req.params.id;

  PropModel.findByIdAndRemove(id, (err, propiedadBorrado) => {
    if (err) {
      return res.status(500).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error borrando propiedad",
        errors: err // Este objeto con los errores viene de mongoose
      });
    }

    if (!propiedadBorrado) {
      return res.status(400).json({
        // ERROR DE BASE DE DATOS
        ok: false,
        mensaje: "Error borrando propiedad, el propiedad solicitado NO existe.",
        errors: { message: "No existe el propiedad que intenta borrar." } // Este objeto con los errores viene de mongoose
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Propiedad borrada correctamente.",
      propiedad: propiedadBorrado
    });
  });
}

module.exports = {
  getPropsAll,
  getProps,
  getProp,
  createProp,
  updateProp,
  pauseProp,
  deleteProp,
  createDetails,
  updateDetails,
  changeStatus
};
