var express = require('express');

var app = express();

var Propiedad = require('../models/propiedad.model');
var Usuario = require('../models/usuario.model');

var Localidad = require('../models/localidad.model');
var TipoInmueble = require('../models/tipo_inmuebles.model');
var TipoOperacion = require('../models/tipo_operaciones.model');

// ==============================
// Busqueda por colección
// ==============================
// app.get('/coleccion/:coleccion/:patron', (req, res) => {


function buscarInicio(req, res) {

    var tipooperacion = req.params.tipooperacion;
    var tipoinmueble = req.params.tipoinmueble;
    var localidad = req.params.localidad;
    console.log(tipooperacion, tipoinmueble, localidad);


    TipoOperacion.findById(tipooperacion, (err, operacion) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!operacion) {
            return res.status(400).json({
                ok: false,
                message: 'No existe operación para el id solicitado'
            })
        }



    })
}





function buscarEnColeccion(req, res) {


    var patron = req.params.patron;
    var coleccion = req.params.coleccion;
    var regex = new RegExp(patron, 'i');

    var promesa;

    switch (coleccion) {

        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;

        case 'propiedades':
            promesa = buscarPropiedades(regex);
            break;
        case 'localidades':
            promesa = buscarLocalidades(patron, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Las colecciones admitidas sólo son: usuarios, propiedades',
                error: { message: 'Tipo de coleccion/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [coleccion]: data
        });

    }).catch(err => {
        res.status(200).json({
            ok: false,
            [coleccion]: err
        });
    })

}


// ==============================
// Busqueda general
// ==============================
// app.get('/todo/:patron', (req, res, next) => {
function buscarTodasColecciones(req, res) {


    var patron = req.params.patron;
    var regex = new RegExp(patron, 'i');


    Promise.all([
        buscarPropiedades(patron, regex),
        buscarUsuarios(patron, regex)
    ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                propiedades: respuestas[0],
                usuarios: respuestas[1]
            });
        })


}


function buscarPropiedades(regex) {

    return new Promise((resolve, reject) => {

        Propiedad.find({})
            .or([
                { descripcion: regex },
                { zonificacion: regex },
                { pais: regex },
                { provincia: regex },
                { ciudad: regex },
                { barrio: regex },
                { tipopropiedad: regex },
                { ambienteslista: regex }
            ])
            .populate('usuario', 'nombre email')
            .exec((err, propiedades) => {

                if (err) {
                    reject('Error al cargar propiedades', err);
                } else {
                    resolve(propiedades);
                }
            });
    });
}


function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'img nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            });


    });
}


function buscarLocalidades(patron, regex) {

    return new Promise((resolve, reject) => {
        // Con el fin de evitar sobrecargar al server con peticiones de datos duplicados, le pido al backend
        // que me envíe resultados SOLO cuando ingreso tres caracteres, a partir de esos resultados
        // el filtro lo hace el cliente en el frontend con los datos ya almacenados en this.options.
        if (patron.length != 3) {
            reject('La petición se ejecuta sólo con tres caracteres');
        } else {
            Localidad.find({})
                .or([
                    { 'properties.provincia.nombre': regex },
                    { 'properties.departamento.nombre': regex },
                    { 'properties.nombre': regex }
                ])
                .exec((err, localidadesEncontradas) => {

                    if (err) {
                        reject('Error al cargar localidades', err);
                    } else {
                        resolve(localidadesEncontradas);
                    }
                });
        }


    });
}
module.exports = { buscarEnColeccion, buscarTodasColecciones, buscarInicio };