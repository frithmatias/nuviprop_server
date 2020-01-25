var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var detallesSchema = new Schema({
    orientacion: { type: String, required: [true, "El dato orientacion es necesario en el modelo de detalles"] },
    superficiecubierta: { type: Number, required: [true, "El dato superficiecubierta es necesario en el modelo de detalles"] },
    superficiedescubierta: { type: Number, required: [true, "El dato superficiedescubierta es necesario en el modelo de detalles"] },
    cantidaddedormitorios: { type: Number, required: [true, "El dato cantidaddedormitorios es necesario en el modelo de detalles"] },
    cantidaddebanios: { type: Number, required: [true, "El dato cantidaddebanios es necesario en el modelo de detalles"] },
    cantidaddetoilettes: { type: Number, required: [true, "El dato cantidaddetoilettes es necesario en el modelo de detalles"] },
    cantidaddecocheras: { type: Number, required: [true, "El dato cantidaddecocheras es necesario en el modelo de detalles"] },
    cantidaddeplantas: { type: Number, required: [true, "El dato cantidaddeplantas es necesario en el modelo de detalles"] },
    cantidaddeambientes: { type: Number, required: [true, "El dato cantidaddeambientes es necesario en el modelo de detalles"] },
    antiguedad: { type: Number, required: [true, "El dato antiguedad es necesario en el modelo de detalles"] },
    longitudfrente: { type: Number, required: [true, "El dato longitudfrente es necesario en el modelo de detalles"] },
    longitudfondo: { type: Number, required: [true, "El dato longitudfondo es necesario en el modelo de detalles"] },
    tipotecho: { type: String, required: [true, "El dato tipotecho es necesario en el modelo de detalles"] },
    tipovista: { type: String, required: [true, "El dato tipovista es necesario en el modelo de detalles"] },
    tipopiso: { type: String, required: [true, "El dato tipopiso es necesario en el modelo de detalles"] },
    estado: { type: String, required: [true, "El dato estado es necesario en el modelo de detalles"] },
    ambientes: { type: String, required: [true, "El dato ambientes es necesario en el modelo de detalles"] },
    instalaciones: { type: String, required: [true, "El dato instalaciones es necesario en el modelo de detalles"] },
    servicios: { type: String, required: [true, "El dato servicios es necesario en el modelo de detalles"] },
    expensas: { type: String, required: [true, "El dato expensas es necesario en el modelo de detalles"] },
    tipoexpensas: { type: String, required: [true, "El dato tipoexpensas es necesario en el modelo de detalles"] },
    disposicion: { type: String, required: [true, "El dato disposicion es necesario en el modelo de detalles"] },
    tipocochera: { type: String, required: [true, "El dato tipocochera es necesario en el modelo de detalles"] },
    tipocoberturacochera: { type: String, required: [true, "El dato tipocoberturacochera es necesario en el modelo de detalles"] },
    tipobalcon: { type: String, required: [true, "El dato tipobalcon es necesario en el modelo de detalles"] },

    // REQUIRED: FALSE (A incluir en el formulario)
    tipopendiente: { type: String, required: [false, "El dato tipopendiente es necesario en el modelo de detalles"] },
    superficiedelterreno: { type: Number, required: [false, "El dato superficiedelterreno es necesario en el modelo de detalles"] },
    tipocosta: { type: String, required: [false, "El dato tipocosta es necesario en el modelo de detalles"] },
    tipoterreno: { type: String, required: [false, "El dato tipoterreno es necesario en el modelo de detalles"] }


}, { collection: "detalles" });
module.exports = mongoose.model("Detalle", detallesSchema);
