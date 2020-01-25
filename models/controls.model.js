var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ControlsSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre del control es necesario"] },
    id: { type: String, required: [true, "El id descriptivo del control es necesario"] },
    type: { type: String, required: [true, "El type del control es necesario"] },
    datatype: { type: String, required: [true, "El datatype del control es necesario"] },
    required: { type: Boolean, required: [true, "El required del control es necesario"] }
}, { collection: "controls" }
);
module.exports = mongoose.model("Controls", ControlsSchema);
