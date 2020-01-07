var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var localidadSchema = new Schema(
    {
        properties: {
            categoria: { type: String, required: false },
            fuente: { type: String, required: false },
            nombre: { type: String, required: false },
            id: { type: String, required: false },
            municipio: {
                nombre: { type: String, required: false },
                id: { type: String, required: false }
            },
            departamento: {
                nombre: { type: String, required: false },
                id: { type: String, required: false }
            },
            provincia: {
                nombre: { type: String, required: false },
                id: { type: String, required: false },
            },
            localidad_censal: {
                nombre: { type: String, required: false },
                id: { type: String, required: false },
            },
            type: { type: String, required: false }

        },
        type: { type: String, required: false },
        geometry: {
            coordinates: { type: [String], required: false },
        }
    },
    { collection: "localidades" }
);

module.exports = mongoose.model("Localidad", localidadSchema);
