var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tipovistaSchema = new Schema({
    nombre: { type: String, required: [true, "falta nombre del tipo de vista"] },
    id: { type: String, required: [true, "falta id del tipo de vista"] }
}, { collection: "detalles_tipovista" }
);
module.exports = mongoose.model("tipovista", tipovistaSchema);
