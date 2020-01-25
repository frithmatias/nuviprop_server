var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cambioSchema = new Schema(
    {

        // recibe un objeto de JS
        nombre: { type: String, required: [true, "falta nombre del tipo de unidad"] },
        id: { type: String, required: [true, "falta id del tipo de unidad"] },

    },
    { collection: "avisos_tipocambio" }
);

module.exports = mongoose.model("Cambio", cambioSchema);
