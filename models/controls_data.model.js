var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ControlsDataSchema = new Schema({
    control: { type: String, required: [true, "El nombre del control es necesario"] },
    nombre: { type: String, required: [true, "El id descriptivo del control es necesario"] },
    id: { type: String, required: [true, "El id descriptivo de la opcion es necesario"] }
}, { collection: "controls_data" }
);
module.exports = mongoose.model("ControlsData", ControlsDataSchema);
