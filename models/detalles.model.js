var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var detallesSchema = new Schema(
    {

        // recibe un objeto de JS
        terraza: { type: String, required: [true, "falta terraza"] }
    },
    { collection: "detalles" }
);

module.exports = mongoose.model("Detalle", detallesSchema);
