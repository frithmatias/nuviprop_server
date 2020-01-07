var tipoOperacion = require('../models/tipo_operaciones.model');
var tipoInmueble = require('../models/tipo_inmuebles.model');
var tipoUnidad = require('../models/tipo_unidades.model');
var provinciaModel = require('../models/tipo_provincias.model');
var propiedadModel = require('../models/propiedad.model');
var localidadModel = require('../models/localidad.model');

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

    // TIPO DE OPERACION
    var operacion = req.params.operacion;
    var operaciones = operacion.split('-');

    // TIPO DE INMUEBLE
    var inmueble = req.params.inmueble;
    var inmuebles = inmueble.split('-');

    // LOCALIDAD 
    var localidad = req.params.localidad;
    localidad = localidad.replace(/_/g, ' ');
    var localidades = localidad.split('-');




    var pagina = req.params.pagina || 0;
    pagina = Number(pagina);
    var desde = pagina * 20;
    var query = {};

    console.log('operaciones: ', operaciones);
    console.log('inmuebles: ', inmuebles);
    console.log('localidades: ', localidades);

    if (typeof operacion != 'undefined') query['tipooperacion._id'] = operacion;
    if (typeof inmueble != 'undefined') query['tipoinmueble._id'] = inmueble;
    query['localidad._id'] = localidad;


    // console.log('Reultado del query:', query);
    console.log(localidades[0]);
    //Propiedad.find({a, 'nombre email img role')
    const aggregate = propiedadModel.aggregate([{
        // db.propiedades.aggregate([{
        $project:
        {
            "localidad.nombre": { $toLower: "$localidad.nombre" },
            "tipoinmueble.id": { $toLower: "$tipoinmueble.id" },
            "tipooperacion.id": { $toLower: "$tipooperacion.id" },
        }
    }, {
        $match: {
            $and: [
                { "tipooperacion.id": { $in: operaciones } },
                { "tipoinmueble.id": { $in: inmuebles } },
                { "localidad.nombre": { $in: localidades } }
            ]
        }
    }])

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
            console.log('RESPUESTA:', propiedades);

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
module.exports = { getOperaciones, getInmuebles, getUnidades, getProvincias, getPropsCriteria, getLocalidaesEnDepartamento };