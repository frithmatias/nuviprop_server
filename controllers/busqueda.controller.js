var express = require('express');

var app = express();

var Propiedad = require('../models/propiedad.model');
var Usuario = require('../models/usuario.model');

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
            promesa = buscarUsuarios(patron, regex);
            break;

        case 'propiedades':
            promesa = buscarPropiedades(patron, regex);
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


function buscarPropiedades(patron, regex) {

    return new Promise((resolve, reject) => {

        Propiedad.find({ nombre: regex })
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


function buscarUsuarios(patron, regex) {

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



module.exports = { buscarEnColeccion, buscarTodasColecciones };