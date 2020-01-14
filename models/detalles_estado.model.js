var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var estadoSchema = new Schema({
    nombre: { type: String, required: [true, "falta nombre del tipo de estado"] },
    id: { type: String, required: [true, "falta id del tipo de estado"] }
}, { collection: "detalles_estado" }
);
module.exports = mongoose.model("estado", estadoSchema);
