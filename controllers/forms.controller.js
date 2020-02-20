var ControlModel = require('../models/control.model');
var ControlData = require('../models/control_data.model');
var FormModel = require('../models/forms.model');

function createControl(req, res) {
	var body = req.body;
	var control = new ControlModel({
		nombre: body.nombre,
		id: body.id,
		type: body.type,
		required: body.required
	});

	control.save((err, controlsaved) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error guardando el control',
				errors: err
			});
		}
		
		if(body.opciones){
			body.opciones.forEach(opcion => {
				var guardaropcion = new ControlData({
					control: controlsaved._id,
					nombre: opcion
				});
	
				guardaropcion.save((err, opcionguardada) => {
					if (err) {
						return res.status(500).json({
							ok: false,
							mensaje: 'Se guardo el control, pero hubo problemas al guardar las opciones.',
							errors: err
						});
					}
				});
			});
		}

		res.status(201).json({
			ok: true,
			mensaje: "Control guardado correctamente.",
			control: controlsaved
		});
	});
}

function setFormControls(req, res) {
	var tipooperacion = req.body.tipooperacion;
	var tipoinmueble = req.body.tipoinmueble;
	var controls = req.body.controls;
	FormModel.find({ 'tipooperacion': tipooperacion, 'tipoinmueble': tipoinmueble }).exec((err, formulario) => {
		// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos
		formulario = formulario[0];
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error cargando el formulario',
				errors: err
			});
		}


		if (!formulario) {
			// Si no existe formulario, se crea uno nuevo.
			formulario = new FormModel({
				tipooperacion,
				tipoinmueble,
				controls
			});
		} else {
			// Si existe, se modifican sus propiedades.
			formulario.tipooperacion = tipooperacion;
			formulario.tipoinmueble = tipoinmueble;
			formulario.controls = controls;

		}

		formulario.save((err, formularioGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: "Error guardando el formulario"
				});
			}

			res.status(201).json({
				ok: true,
				mensaje: "Formulario guardado correctamente.",
				form: formularioGuardado
			});
		});
	});
}

function getAllControls(req, res) {

	ControlModel.find({})
		// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos
		.exec(
			(err, controls) => {

				if (err) {
					return res.status(500).json({
						ok: false,
						mensaje: 'Error cargando el formulario',
						errors: err
					});
				}

				if (controls == "") {
					return res.status(400).json({
						ok: false,
						mensaje: 'No existe formulario para las opciones solicitadas.',
						errors: err
					});
				}


				// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos

				ControlData.find({}).exec((err, options) => {
					controls.forEach(control => {
						// inserto la propiedad 'options' en cada 'control'
						if (control.type === 'select') {
							control.options = options.filter(option => {
								return control._id.toString() === option.control;
							});
						}
					});
					res.status(200).json({
						ok: true,
						controls: controls
					});
				});
			});
}

function getFormControls(req, res) {

	var tipooperacion = req.params.tipooperacion;
	var tipoinmueble = req.params.tipoinmueble;
	FormModel.find({ 'tipooperacion': tipooperacion, 'tipoinmueble': tipoinmueble }).lean().exec((err, form) => {
		// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error cargando el formulario'
			});
		}

		if (!form) {
			return res.status(204).json({
				ok: false,
				mensaje: 'No existe formulario para las opciones solicitadas.',
				form: []
			});
		}

		res.status(200).json({
			ok: true,
			form: form
		});
	});
}

function getFormControlsAndData(req, res) {

	var tipooperacion = req.params.tipooperacion;
	var tipoinmueble = req.params.tipoinmueble;
	FormModel.find({ 'tipooperacion': tipooperacion, 'tipoinmueble': tipoinmueble }).lean().exec((err, form) => {
		// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error cargando el formulario'
			});
		}

		if (form.length === 0) {
			return res.status(204).json({
				ok: false,
				mensaje: 'No existe formulario para las opciones solicitadas.',
				form: []
			});
		}

		ControlModel.find({ _id: { $in: form[0].controls } }).lean().exec((err, controls) => {
			// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos
			ControlData.find({}).lean().exec((err, options) => {
				controls.forEach(control => {
					// inserto la propiedad 'options' en cada 'select' o 'select_multiple'
					if ((control.type === 'select') || (control.type === 'select_multiple')) {
						control.options = options.filter(option => {
							return control._id.toString() === option.control;
						});
					}
				});
				res.status(200).json({
					ok: true,
					controls: controls
				});
			});
		});
	});
}

module.exports = { createControl, setFormControls, getAllControls, getFormControls, getFormControlsAndData };