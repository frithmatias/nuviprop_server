var tipoOperacion = require('../models/tipo_operaciones.model');
var tipoInmueble = require('../models/tipo_inmuebles.model');
var tipoUnidad = require('../models/tipo_unidades.model');

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
module.exports = { getOperaciones, getInmuebles, getUnidades };