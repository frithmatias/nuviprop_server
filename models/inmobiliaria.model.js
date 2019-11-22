var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var inmobiliariaSchema = new Schema(
    {
        // recibe un objeto de JS
        nombre: { type: String, required: [true, "El nombre de la inmobiliaria es necesario"] },
        calle: { type: String, required: false },
        numero: { type: Number, required: false },
        img: { type: String, required: false },
        usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

    },
    { collection: "inmobiliarias" }
);

module.exports = mongoose.model("Inmobiliaria", inmobiliariaSchema);
