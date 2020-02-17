var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ControlsSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre del control es necesario"] },
    id: { type: String, required: [true, "El id del control es necesario"] },
    type: { type: String, required: [true, "El type del control es necesario"] },
    required: { type: Boolean, required: [true, "El required del control es necesario"] },
    opciones: { type: [String], required: false, default: undefined}
    // default: undefined -> Como opciones es opcional, previene de guardar un array vacío []
}, { collection: "controls" }
);
module.exports = mongoose.model("Control", ControlsSchema);
