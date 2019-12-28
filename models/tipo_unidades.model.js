var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var unidadesSchema = new Schema(
    {

        // recibe un objeto de JS
        nombre: { type: String, required: [true, "falta nombre del tipo de unidad"] },
        id: { type: String, required: [true, "falta id del tipo de unidad"] },
        idparent: { type: String, required: [true, "falta id del tipo de inmueble"] }

    },
    { collection: "tipo_unidades" }
);

module.exports = mongoose.model("Unidades", unidadesSchema);
