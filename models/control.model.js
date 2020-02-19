var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ControlsSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre del control es necesario"] },
    id: { type: String, required: [true, "El id del control es necesario"] },
    type: { type: String, required: [true, "El type del control es necesario"] },
    required: { type: Boolean, required: [true, "El required del control es necesario"] }
    // opciones: { type: [String], required: false, default: undefined}
    // default: undefined -> previene de guardar un array vacío []
    // En caso de que el front envíe las opciones para type 'select' y 'select_multiple', 
    // se guardan como campos en control_data
}, { collection: "controls" }
);
module.exports = mongoose.model("Control", ControlsSchema);
