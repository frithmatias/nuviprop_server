var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var inmueblesSchema = new Schema(
    {

        // recibe un objeto de JS
        nombre: { type: String, required: [true, "falta nombre del tipo de inmueble"] },
        id: { type: String, required: [true, "falta id del tipo de inmueble"] }

    },
    { collection: "tipo_inmuebles" }
);

module.exports = mongoose.model("Inmuebles", inmueblesSchema);
