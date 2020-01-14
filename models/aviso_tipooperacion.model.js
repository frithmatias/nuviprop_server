var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var operacionesSchema = new Schema(
    {

        // recibe un objeto de JS
        nombre: { type: String, required: [true, "falta nombre del tipo de operacion"] },
        id: { type: String, required: [true, "falta id del tipo de operacion"] }

    },
    { collection: "avisos_tipooperacion" }
);

module.exports = mongoose.model("Operaciones", operacionesSchema);
