var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var detallesSchema = new Schema(
    {

        superficietotal: { type: Number, required: [true, "Indique la superficietotal"] },
        superficieconstruible: { type: Number, required: [true, "Indique la superficieconstruible"] },
        zonificacion: { type: String, required: [true, "Indique la zonificacion"] },
        longitudfondo: { type: Number, required: [true, "Indique la longitudfondo"] },
        longitudfrente: { type: Number, required: [true, "Indique la longitudfrente"] },
        tipoterreno: { type: String, required: [true, "Indique la tipoterreno"] },
        fot: { type: String, required: [true, "Indique la fot"] },
        fos: { type: String, required: [true, "Indique la fos"] },
        tipopendiente: { type: String, required: [true, "Indique la tipopendiente"] },
        tipovista: { type: String, required: [true, "Indique la tipovista"] },
        tipocosta: { type: String, required: [true, "Indique la tipocosta"] },
        estado: { type: String, required: [true, "Indique la estado"] },
        propiedadocupada: { type: Boolean, required: [true, "Indique la propiedadocupada"] },
        fondoirregular: { type: Boolean, required: [true, "Indique la fondoirregular"] },
        frenteirregular: { type: Boolean, required: [true, "Indique la frenteirregular"] },
        demolicion: { type: Boolean, required: [true, "Indique la demolicion"] },
        lateralizquierdoirregular: { type: Boolean, required: [true, "Indique la lateralizquierdoirregular"] },
        lateralderechoirregular: { type: Boolean, required: [true, "Indique la lateralderechoirregular"] },
        instalaciones: { type: [String], required: [true, "Indique la instalaciones"] },
        servicios: { type: [String], required: [true, "Indique la servicios"] }
    },
    { collection: "detalles" }
);

module.exports = mongoose.model("Detalle", detallesSchema);
