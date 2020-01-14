var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var provinciasSchema = new Schema(
    {

        _id: { type: String, required: false },
        properties: {
            nombre_completo: { type: String, required: false },
            fuente: { type: String, required: false },
            iso_id: { type: String, required: false },
            nombre: { type: String, required: false },
            id: { type: String, required: false },
            categoria: { type: String, required: false },
            iso_nombre: { type: String, required: false }
        },
        type: { type: String, required: false },
        geometry: {
            coordinates: { type: [Number], required: false },
            type: String
        }
    },
    { collection: "provincias" }
);

module.exports = mongoose.model("Provincias", provinciasSchema);


