var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var serviciosSchema = new Schema({
    nombre: { type: String, required: [true, "falta nombre del tipo de servicio"] },
    id: { type: String, required: [true, "falta id del tipo de servicio"] }
}, { collection: "detalles_servicios" }
);
module.exports = mongoose.model("servicios", serviciosSchema);
