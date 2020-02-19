var InmobModel = require('../models/inmobiliaria.model');

// ==========================================
// Obtener todas los inmobiliariaes
// ==========================================
function getInmobs(req, res) {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    InmobModel.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, inmobiliarias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando la inmobiliaria',
                        errors: err
                    });
                }

                InmobModel.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        inmobiliarias: inmobiliarias,
                        total: conteo
                    });
                });

            });
}

// ==========================================
//  Obtener Inmobiliaria por ID
// ==========================================
function getInmob(req, res) {

    var id = req.params.id;

    InmobModel.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, inmobiliaria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar inmobiliaria',
                    errors: err
                });
            }

            if (!inmobiliaria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El inmobiliaria con el id ' + id + 'no existe',
                    errors: { message: 'No existe un inmobiliaria con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                inmobiliaria: inmobiliaria
            });
        });
}

// ==========================================
// Crear un nuevo inmobiliaria
// ==========================================
function createInmob(req, res) {

    var body = req.body;
    var inmobiliaria = new InmobModel({
        nombre: body.nombre,
        usuario: req.usuario._id //el middleware auth "inyecta" el usuario en req.
    });
    inmobiliaria.save((err, inmobiliariaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear inmobiliaria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            inmobiliaria: inmobiliariaGuardado
        });


    });

};

// ==========================================
// Actualizar Inmobiliaria
// ==========================================
function updateInmob(req, res) {

    var id = req.params.id;
    var body = req.body;

    InmobModel.findById(id, (err, inmobiliaria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar inmobiliaria',
                errors: err
            });
        }

        if (!inmobiliaria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El inmobiliaria con el id ' + id + ' no existe',
                errors: { message: 'No existe un inmobiliaria con ese ID' }
            });
        }


        inmobiliaria.nombre = body.nombre;
        inmobiliaria.usuario = req.usuario._id;

        inmobiliaria.save((err, inmobiliariaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar inmobiliaria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                inmobiliaria: inmobiliariaGuardada
            });

        });

    });
}

// ============================================
//   Borrar un inmobiliaria por el id
// ============================================
function deleteInmob(req, res) {

    var id = req.params.id;

    InmobModel.findByIdAndRemove(id, (err, inmobiliariaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar inmobiliaria',
                errors: err
            });
        }

        if (!inmobiliariaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un inmobiliaria con ese id',
                errors: { message: 'No existe un inmobiliaria con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            inmobiliaria: inmobiliariaBorrado
        });

    });

};

module.exports = { getInmobs, getInmob, createInmob, updateInmob, deleteInmob };
