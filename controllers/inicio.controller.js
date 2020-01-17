var tipoOperacion = require('../models/aviso_tipooperacion.model');
var tipoInmueble = require('../models/aviso_tipoinmueble.model');
var tipoUnidad = require('../models/aviso_tipounidad.model');
var provinciaModel = require('../models/aviso_provincia.model');
var avisoModel = require('../models/aviso.model');
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

function getAvisosCriteria(req, res) {
    // desde es una variable que utilizo para decile desde donde empiece a traer registros,
    // y desde ahí me traiga los siguientes 5 registros.
    // http://localhost:3000/aviso?desde=10

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

    console.log('operaciones: ', operaciones);
    console.log('inmuebles: ', inmuebles);
    console.log('localidades: ', localidades);

    if ((operacion === 'undefined') || (inmueble === 'undefined')) {
        return res.status(400).json({
            // ERROR DE BASE DE DATOS
            ok: false,
            mensaje: "No se indica tipo de operación o el tipo de inmueble."
        });
    }

    //Aviso.find({a, 'nombre email img role')
    const aggregate = avisoModel.aggregate([
        // db.avisos.aggregate([{
        //     $addFields:
        //     {
        //         "localidad": { $toLower: "$localidad.nombre" },
        //         "tipoinmueble": { $toLower: "$tipoinmueble.id" },
        //         "tipooperacion": { $toLower: "$tipooperacion.id" },

        //     }
        // }, 
        // {


        // Convierto los ObjectId("5e04b4bd3cb7d5a2401c9895")}) a String "5e04b4bd3cb7d5a2401c9895"
        // La función inversa es $toObjectId -> {$toObjectId: "5ab9cbfa31c2ab715d42129e"}
        {
            $addFields:
            {
                "localidad": { $toString: "$localidad" },
                "tipoinmueble": { $toString: "$tipoinmueble" },
                "tipooperacion": { $toString: "$tipooperacion" },

            }
        },
        {
            $match: {
                $and: [
                    { "tipooperacion": { $in: operaciones } },
                    { "tipoinmueble": { $in: inmuebles } },
                    { "localidad": { $in: localidades } }
                ]
            }
        }])

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
            console.log('RESPUESTA:', avisos);

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
module.exports = { getOperaciones, getInmuebles, getUnidades, getProvincias, getAvisosCriteria, getLocalidaesEnDepartamento };