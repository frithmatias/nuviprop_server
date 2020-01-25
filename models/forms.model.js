var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var FormsSchema = new Schema({
    tipooperacion: { type: String, required: [true, "El tipooperacion del formulario es necesario"] },
    tipoinmueble: { type: String, required: [true, "El tipoinmueble del formulario es necesario"] },
    controls: { type: [String], required: [true, "Los controles para el formulario son necesarios"] },
}, { collection: "forms" }
);
module.exports = mongoose.model("Forms", FormsSchema);
