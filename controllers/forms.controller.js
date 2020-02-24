var ControlModel = require('../models/control.model');
var ControlOptionsModel = require('../models/control_options.model');
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

		if (body.opciones) {
			body.opciones.forEach(opcion => {
				var guardaropcion = new ControlOptionsModel({
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

function editControl(req, res) {
	var body = req.body;
	var id = req.params.idcontrol;

	// 1. GUARDA EL CONTROL 
	// 2. GUARDA LAS OPCIONES DEL CONTROL 

	// 1. Guardo el control con los nuevos valores
	ControlModel.findById(id, (err, controltosave) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error buscando el control',
				errors: err
			});
		}
		if (!controltosave) {
			return res.status(500).json({
				ok: false,
				mensaje: 'No existe el control que desea actualizar!',
				errors: err
			});
		}
		controltosave.nombre = req.body.nombre;
		controltosave.type = req.body.type;
		controltosave.required = req.body.required;
		controltosave.save((err, controlsaved) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error guardando el control',
					errors: err
				});
			}
			// Si llegó hasta acá, el control fue guardado ok.


			// 2. Guardo las opciones nuevas (solo si es un control tipo select o select_multi, 
			// y sólo las opciones modificadas) que llegan en el array body.opciones
			if(!['select','select_multiple'].includes(req.body.type)){
				console.log('El control no posee opciones');
				return res.status(200).json({
					ok: true,
					mensaje: 'Se guardo el control, pero el control no tenía opciones.'
				});
			}

			req.body.opcionesdata.map((opcion, i) => {

				if (req.body.opciones[i] !== req.body.opcionesdata[i].nombre) {
				console.log(req.body.opciones[i], ' opcion modificada');
				
				ControlOptionsModel.findById(opcion._id, (err, optiontosave) => {

					if (err) {
						return res.status(500).json({
							ok: false,
							mensaje: 'Error buscando la opcion',
							errors: err
						});
					}

					if (!optiontosave) {
						return res.status(500).json({
							ok: false,
							mensaje: 'No existe la opcion que desea actualizar!',
							errors: err
						});
					}

					// SOLO GUARDO AQUELLAS OPCIONES QUE FUERON MODIFICADAS EN SU NOMBRE.

						optiontosave.nombre = req.body.opciones[i];
						optiontosave.save((err, optionsaved) => {
							if (err) {
								return res.status(500).json({
									ok: false,
									mensaje: 'Error guardando la opcion',
									errors: err
								});
							}
						});

				});

				} else {
					console.log(req.body.opciones[i], ' sin cambios');
				}
			});
			res.status(201).json({
				ok: true,
				mensaje: "Control guardado correctamente.",
				controlsaved
			});
		});
	});

				// res.status(201).json({
				// 	ok: true,
				// 	mensaje: "Control guardado correctamente."
				// });
	// opcionesdata: Array(8)
	// 		0:
	// 			_id: "5e2857aa0dfb17251055dc10"
	// 			control: "5e2704cce13bdf0c315eb307"
	// 			nombre: "Norte"
	// 			id: "orientacion_norte"
	// 		1: {_id: "5e2857aa0dfb17251055dc11", control: "5e2704cce13bdf0c315eb307", nombre: "Noreste", id: "orientacion_noreste"}
	// 		2: {_id: "5e2857aa0dfb17251055dc12", control: "5e2704cce13bdf0c315eb307", nombre: "Noroeste", id: "orientacion_noroeste"}
	// 		3: {_id: "5e2857aa0dfb17251055dc13", control: "5e2704cce13bdf0c315eb307", nombre: "Sur", id: "orientacion_sur"}
	// 		4: {_id: "5e2857aa0dfb17251055dc14", control: "5e2704cce13bdf0c315eb307", nombre: "Sureste", id: "orientacion_sureste"}
	// 		5: {_id: "5e2857aa0dfb17251055dc15", control: "5e2704cce13bdf0c315eb307", nombre: "Suroeste", id: "orientacion_suroeste"}
	// 		6: {_id: "5e2857aa0dfb17251055dc16", control: "5e2704cce13bdf0c315eb307", nombre: "Este", id: "orientacion_este"}
	// 		7: {_id: "5e2857aa0dfb17251055dc17", control: "5e2704cce13bdf0c315eb307", nombre: "Oeste", id: "orientacion_oeste"}
	// 		length: 8
	// nombre: "Orientacion"
	// id: "orientacion"
	// type: "select"
	// opciones: Array(8) // <<<<----- ACA ESTAN LOS VALORES EDITADOS!
	// 		0: "Norte"
	// 		1: "Noreste"
	// 		2: "Noroeste"
	// 		3: "Sur"
	// 		4: "Sureste"
	// 		5: "Suroeste"
	// 		6: "Este"
	// 		7: "Oeste"
	// 		length: 8
	// required: true

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

				ControlOptionsModel.find({}).exec((err, options) => {
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

function getFormControlsAndOptions(req, res) {

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
			ControlOptionsModel.find({}).lean().exec((err, options) => {
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

function getControlOptions(req, res) {
	var idcontrol = req.params.idcontrol;
	console.log(idcontrol);
	ControlModel.findById(idcontrol, (err, control) => {
		console.log(control);
		// LEAN() corre despues de FIND() y se usa para convertir objetos de mongoose en objetos de JS para poder modificarlos
		if ((control.type === 'select') || (control.type === 'select_multiple')) {
			ControlOptionsModel.find({ 'control': control._id }).lean().exec((err, options) => {
				console.log(options);
				// inserto la propiedad 'options' en cada 'select' o 'select_multiple'
				control.options = options;

				res.status(200).json({
					ok: true,
					control,
					options
				});
			});
		} else {
			res.status(200).json({
				ok: true,
				control
			});
		}
	});

}

module.exports = { createControl, editControl, setFormControls, getAllControls, getFormControls, getFormControlsAndOptions, getControlOptions };