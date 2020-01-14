var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var instalacionesSchema = new Schema({
    nombre: { type: String, required: [true, "falta nombre del tipo de instalaciones"] },
    id: { type: String, required: [true, "falta id del tipo de instalaciones"] }
}, { collection: "detalles_instalaciones" }
);
module.exports = mongoose.model("instalaciones", instalacionesSchema);
