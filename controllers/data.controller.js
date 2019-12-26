var tipoOperacion = require('../models/tipo_operaciones.model');
var tipoInmueble = require('../models/tipo_inmuebles.model');

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
module.exports = { getOperaciones, getInmuebles };