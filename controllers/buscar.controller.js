var express = require('express');

var app = express();

var Aviso = require('../models/aviso.model');
var Usuario = require('../models/usuario.model');
var Localidad = require('../models/localidad.model');

// ==============================
// Busqueda por colección
// ==============================
// app.get('/coleccion/:coleccion/:patron', (req, res) => {

function buscarEnColeccion(req, res) {


    var patron = req.params.patron;
    var coleccion = req.params.coleccion;
    var regex = new RegExp(patron, 'i');

    var promesa;

    switch (coleccion) {

        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;

        case 'avisos':
            promesa = buscarAvisos(regex);
            break;
        case 'localidades':
            promesa = buscarLocalidades(patron, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Las colecciones admitidas sólo son: usuarios, avisos',
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
        buscarAvisos(patron, regex),
        buscarUsuarios(patron, regex)
    ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                avisos: respuestas[0],
                usuarios: respuestas[1]
            });
        })


}


function buscarAvisos(regex) {

    return new Promise((resolve, reject) => {

        Aviso.find({})
            .or([
                { descripcion: regex },
                { zonificacion: regex },
                { pais: regex },
                { provincia: regex },
                { ciudad: regex },
                { barrio: regex },
                { tipoaviso: regex },
                { ambienteslista: regex }
            ])
            .populate('usuario', 'nombre email')
            .exec((err, avisos) => {

                if (err) {
                    reject('Error al cargar avisos', err);
                } else {
                    resolve(avisos);
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
module.exports = { buscarEnColeccion, buscarTodasColecciones };