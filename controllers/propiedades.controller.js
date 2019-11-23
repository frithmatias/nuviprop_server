var PropModel = require("../models/propiedad.model");

// http://localhost:3000/propiedad

// ==================================================
// Obtener todos los propiedads
// ==================================================
function getProps(req, res) {
  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/propiedad?desde=10
  var desde = req.query.desde || 0;
  desde = Number(desde);

  //Propiedad.find({a, 'nombre email img role')
  PropModel.find({})
    .skip(desde)
    .limit(5)
    .exec((err, propiedads) => {
      // el segundo argumento es un callback (err, propiedads) =>

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
          propiedads: propiedads,
          total: cantidad
          // En standar ES6 no haría falta definir propiedads: propiedads porque es como redundante,
          // pero lo vamos a dejar así para que sea mas claro.
        });
      });
    });
}

// ==================================================
// Obtener sólo una propiedad por su id
// ==================================================
function getProp(req, res) {

  // desde es una variable que utilizo para decile desde donde empiece a traer registros,
  // y desde ahí me traiga los siguientes 5 registros.
  // http://localhost:3000/propiedad?desde=10
  var id = req.params.id || 0;
  console.log(id);
  console.log(req.params);
  //Propiedad.find({a, 'nombre email img role')
  PropModel.findById(id)
    .populate('usuario', 'nombre img email')
    .populate('inmobiliaria')
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

// ==================================================
// Crear un nuevo propiedad
// ==================================================

function createProp(req, res) {
  var body = req.body;
  var propiedad = new PropModel({
    zonificacion: body.zonificacion,
    pais: body.pais,
    provincia: body.provincia,
    ciudad: body.ciudad,
    barrio: body.barrio,
    tipopropiedad: body.tipopropiedad,
    calle: body.calle,
    numero: body.numero,
    descripcion: body.descripcion,
    dormitorios: body.dormitorios,
    ambientes: body.ambientes,
    ambienteslista: body.ambienteslista,
    serviciosbasicos: body.serviciosbasicos,
    serviciosgenerales: body.serviciosgenerales,
    expensas: body.expensas,
    banios: body.banios,
    cocheras: body.cocheras,
    terraza: body.terraza,
    aptocredito: body.aptocredito,
    antiguedad: body.antiguedad,
    techo: body.techo,
    estado: body.estado,
    disposicion: body.disposicion,
    operacion: body.operacion,
    precio: body.precio,
    dolares: body.dolares,
    supcubierta: body.supcubierta,
    supdescubierta: body.supdescubierta,
    usuario: req.usuario._id,
    inmobiliaria: body.inmobiliaria,
    imgs: ['no-image.jpg']
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

// ==================================================
// Actualizar un propiedad
// ==================================================
// Debería primero, ademas de los nuevos datos, recibir el _id del propiedad a actualizar
// localhost:3000/propiedad/5c64cae77477e92d88e6219a

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

    // Si no entro a ninguno de los dos IF anteriores, significa que estamos listos para actualizar el propiedad.
    propiedad.zonificacion = body.zonificacion;
    propiedad.pais = body.pais;
    propiedad.provincia = body.provincia;
    propiedad.ciudad = body.ciudad;
    propiedad.barrio = body.barrio;
    propiedad.tipopropiedad = body.tipopropiedad;
    propiedad.calle = body.calle;
    propiedad.numero = body.numero;
    propiedad.descripcion = body.descripcion;
    propiedad.dormitorios = body.dormitorios;
    propiedad.ambientes = body.ambientes;
    propiedad.ambienteslista = body.ambienteslista;
    propiedad.serviciosbasicos = body.serviciosbasicos;
    propiedad.serviciosgenerales = body.serviciosgenerales;
    propiedad.expensas = body.expensas;
    propiedad.banios = body.banios;
    propiedad.cocheras = body.cocheras;
    propiedad.terraza = body.terraza;
    propiedad.aptocredito = body.aptocredito;
    propiedad.antiguedad = body.antiguedad;
    propiedad.techo = body.techo;
    propiedad.estado = body.estado;
    propiedad.disposicion = body.disposicion;
    propiedad.operacion = body.operacion;
    propiedad.precio = body.precio;
    propiedad.dolares = body.dolares;
    propiedad.supcubierta = body.supcubierta;
    propiedad.supdescubierta = body.supdescubierta;
    propiedad.imgs = body.imgs.split(",");

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

function pauseProp(req, res) {
  //TODO, implementar pausar una propiedad
}
// ==================================================
// Borrar un propiedad
// ==================================================
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

module.exports = { getProps, getProp, createProp, updateProp, pauseProp, deleteProp };
