var tipoOperacion = require('../models/tipo_operaciones.model');
var tipoInmueble = require('../models/tipo_inmuebles.model');
var tipoUnidad = require('../models/tipo_unidades.model');
var provinciaModel = require('../models/tipo_provincias.model');
var propiedadModel = require('../models/propiedad.model');
function getOperaciones(req, res) {



    tipoOperacion.find({})
        .exec(
            (err, operaciones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los tipos de operacion',
                        errors: err
                    });
                }

                tipoOperacion.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        operaciones: operaciones,
                        total: conteo
                    });
                });

            });
}

function getInmuebles(req, res) {


    tipoInmueble.find({})
        .exec(
            (err, inmuebles) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los tipos de inmuebles',
                        errors: err
                    });
                }

                tipoInmueble.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        inmuebles: inmuebles,
                        total: conteo
                    });
                });

            });
}

function getUnidades(req, res) {
    var idparent = req.params.idparent;

    tipoUnidad.find({ idparent: idparent })
        .exec(
            (err, unidades) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando las unidades',
                        errors: err
                    });
                }

                tipoUnidad.countDocuments({ idparent: idparent }, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        unidades: unidades,
                        total: conteo
                    });
                });

            });
}

function getProvincias(req, res) {
    provinciaModel.find({})
        .exec(
            (err, provincias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los tipos de operacion',
                        errors: err
                    });
                }

                tipoOperacion.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        provincias: provincias,
                        total: conteo
                    });
                });

            });
}

function getPropsCriteria(req, res) {
    // desde es una variable que utilizo para decile desde donde empiece a traer registros,
    // y desde ahí me traiga los siguientes 5 registros.
    // http://localhost:3000/propiedad?desde=10

    // REQ.BODY -> lo que viene en el body puede ser un objeto 
    // REQ.PARAMS -> lo que viene como parámetros en la URL (propiedad/5e0826513392d12ca077e925)
    // REQ.QUERY -> lo que viene como argumentos en la URL (&nombre=diego&edad=40)
    var operacion = req.params.operacion;
    var inmueble = req.params.inmueble;
    var localidad = req.params.localidad;
    var pagina = req.params.pagina || 0;
    pagina = Number(pagina);
    var desde = pagina * 20;

    //Propiedad.find({a, 'nombre email img role')
    propiedadModel.find({
        "tipooperacion._id": operacion,
        "tipoinmueble._id": inmueble,
        "localidad._id": localidad
    })
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

            propiedadModel.count({ activo: true }, (err, cantidad) => {
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
module.exports = { getOperaciones, getInmuebles, getUnidades, getProvincias, getPropsCriteria };