var formModel = require('../models/form.model');

function getForm(req, res) {

    var id = req.params.id;
    console.log('id:', id);

    formModel.find({ 'name': id })
        .exec(
            (err, form) => {
                console.log(form);
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando el formulario',
                        errors: err
                    });
                }

                if (form == "") {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el formulario',
                        errors: err
                    });
                }

                formModel.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        form: form,
                        total: conteo
                    });
                });

            });
}


module.exports = { getForm };