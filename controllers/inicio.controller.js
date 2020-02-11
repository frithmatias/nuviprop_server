var tipoOperacion = require('../models/aviso_tipooperacion.model');
var tipoInmueble = require('../models/aviso_tipoinmueble.model');
var tipoUnidad = require('../models/aviso_tipounidad.model');
var tipoCambio = require('../models/aviso_tipocambio.model');
var provinciaModel = require('../models/aviso_provincia.model');
var localidadModel = require('../models/localidad.model');

function prueba(req, res) {
    res.status(200).json({
        ok: true,
        resp: 'Express Server corriendo.'
    });
}

function getOperaciones(req, res) {
    tipoOperacion.find({},
            (err, operaciones) => {
            console.log(operaciones);
            console.log(err);
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

function getCambio(req, res) {
    var idparent = req.params.idparent;

    tipoCambio.find({})
        .exec(
            (err, tipocambio) => {

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
                        tipocambio,
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

function getLocalidaesEnDepartamento(req, res) {
    let idlocalidad = req.params.idlocalidad;
    console.log(idlocalidad);
    localidadModel.findById(idlocalidad)
        .exec((err, localidad) => {
            if (err) {
                // Un findById no debería retorar NINGUN error, si no lo encuentra, retorna un usuario vacío
                // por lo tanto, si encuentra un error lo configuro como un error 500 'Internal Server Error'
                return res.status(500).json({
                    // ERROR DE BASE DE DATOS
                    ok: false,
                    mensaje: "Error al buscar la localidad",
                    errors: err
                });
            }
            console.log(localidad);
            if (!localidad) {
                return res.status(400).json({
                    // Podría ser 400, Bad request (no encontro el usuario)
                    ok: false,
                    mensaje: "No existe una localidad con el id " + idlocalidad,
                    errors: { message: "No existe localidad con el id solicitado" }
                });
            }

            localidadModel.find({ 'properties.departamento.id': localidad.properties.departamento.id }, (err, localidades) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al buscar localidades en el departamento solicitado",
                        errors: err
                    });
                }
                if (!localidades) {
                    return res.status(400).json({
                        // Podría ser 400, Bad request (no encontro el usuario)
                        ok: false,
                        mensaje: "No existen localidades para el departamento solicitado",
                        errors: { message: "No existen localidades para el departamento solicitado" }
                    });
                }


                return res.status(200).json({
                    ok: true,
                    localidades: localidades
                });
            });

        })



}
module.exports = {
    prueba,
    getOperaciones,
    getInmuebles,
    getUnidades,
    getCambio,
    getProvincias,
    getLocalidaesEnDepartamento
};