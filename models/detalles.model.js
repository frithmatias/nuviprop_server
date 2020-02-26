var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var detallesSchema = new Schema({
    orientacion: { type: String, required: [false, "El dato orientacion es necesario en el modelo de detalles"] },
    superficiecubierta: { type: Number, required: [false, "El dato superficiecubierta es necesario en el modelo de detalles"] },
    superficiedescubierta: { type: Number, required: [false, "El dato superficiedescubierta es necesario en el modelo de detalles"] },
    cantidaddedormitorios: { type: Number, required: [false, "El dato cantidaddedormitorios es necesario en el modelo de detalles"] },
    cantidaddebanios: { type: Number, required: [false, "El dato cantidaddebanios es necesario en el modelo de detalles"] },
    cantidaddetoilettes: { type: Number, required: [false, "El dato cantidaddetoilettes es necesario en el modelo de detalles"] },
    cantidaddecocheras: { type: Number, required: [false, "El dato cantidaddecocheras es necesario en el modelo de detalles"] },
    cantidaddeplantas: { type: Number, required: [false, "El dato cantidaddeplantas es necesario en el modelo de detalles"] },
    cantidaddeambientes: { type: Number, required: [false, "El dato cantidaddeambientes es necesario en el modelo de detalles"] },
    antiguedad: { type: Number, required: [false, "El dato antiguedad es necesario en el modelo de detalles"] },
    longitudfrente: { type: Number, required: [false, "El dato longitudfrente es necesario en el modelo de detalles"] },
    longitudfondo: { type: Number, required: [false, "El dato longitudfondo es necesario en el modelo de detalles"] },
    tipotecho: { type: String, required: [false, "El dato tipotecho es necesario en el modelo de detalles"] },
    tipovista: { type: String, required: [false, "El dato tipovista es necesario en el modelo de detalles"] },
    tipopiso: { type: String, required: [false, "El dato tipopiso es necesario en el modelo de detalles"] },
    estado: { type: String, required: [false, "El dato estado es necesario en el modelo de detalles"] },
    ambientes: { type: [String], required: [false, "El dato ambientes es necesario en el modelo de detalles"] },
    instalaciones: { type: [String], required: [false, "El dato instalaciones es necesario en el modelo de detalles"] },
    servicios: { type: [String], required: [false, "El dato servicios es necesario en el modelo de detalles"] },
    expensas: { type: String, required: [false, "El dato expensas es necesario en el modelo de detalles"] },
    tipoexpensas: { type: String, required: [false, "El dato tipoexpensas es necesario en el modelo de detalles"] },
    disposicion: { type: String, required: [false, "El dato disposicion es necesario en el modelo de detalles"] },
    tipocochera: { type: String, required: [false, "El dato tipocochera es necesario en el modelo de detalles"] },
    tipocoberturacochera: { type: String, required: [false, "El dato tipocoberturacochera es necesario en el modelo de detalles"] },
    tipobalcon: { type: String, required: [false, "El dato tipobalcon es necesario en el modelo de detalles"] },
    luminosidad: { type: String, required: [false, "El dato luminosidad es necesario en el modelo de detalles"] },
    tipopendiente: { type: String, required: [false, "El dato tipopendiente es necesario en el modelo de detalles"] },
    superficiedelterreno: { type: Number, required: [false, "El dato superficiedelterreno es necesario en el modelo de detalles"] },
    tipocosta: { type: String, required: [false, "El dato tipocosta es necesario en el modelo de detalles"] },
    tipoterreno: { type: String, required: [false, "El dato tipoterreno es necesario en el modelo de detalles"] }

}, { strict: false, collection: "detalles" });
module.exports = mongoose.model("Detalle", detallesSchema);
