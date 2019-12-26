var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var localidadSchema = new Schema(
    {
        provincia: { type: String, required: [true, "El dato provincia de propiedad es necesario"] },
        departamento: { type: String, required: [true, "El dato departamento de propiedad es necesario"] },
        localidad: { type: String, required: [true, "El dato localidad de propiedad es necesario"] },
        coords: [{ type: String, required: [true, "El dato coords de propiedad es necesario"] }],
    },
    { collection: "localidades" }
);

module.exports = mongoose.model("Localidad", localidadSchema);
