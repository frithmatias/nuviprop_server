var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tipoterrenoSchema = new Schema({
    nombre: { type: String, required: [true, "falta nombre del tipo de terreno"] },
    id: { type: String, required: [true, "falta id del tipo de terreno"] }
}, { collection: "detalles_tipoterreno" }
);
module.exports = mongoose.model("tipoterreno", tipoterrenoSchema);
