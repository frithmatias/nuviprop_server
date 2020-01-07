var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var detallesSchema = new Schema(
    {

        superficietotal: { type: Number, required: [true, "Indique la superficietotal"] },
        superficiecubierta: { type: Number, required: [true, "Indique la superficiecubierta"] },
        superficiedescubierta: { type: Number, required: [true, "Indique la superficiedescubierta"] },
        superficieconstruible: { type: Number, required: [true, "Indique la superficieconstruible"] },
        zonificacion: { type: String, required: [true, "Indique la zonificacion"] },
        longitudfondo: { type: Number, required: [true, "Indique la longitudfondo"] },
        longitudfrente: { type: Number, required: [true, "Indique la longitudfrente"] },
        tipoterreno: { type: String, required: [true, "Indique la tipoterreno"] },
        factorocupacionaltotal: { type: String, required: [true, "Indique la factorocupacionaltotal"] },
        factorocupacionalsuelo: { type: String, required: [true, "Indique la factorocupacionalsuelo"] },
        tipopendiente: { type: String, required: [true, "Indique la tipopendiente"] },
        tipovista: { type: String, required: [true, "Indique la tipovista"] },
        tipocosta: { type: String, required: [true, "Indique la tipocosta"] },
        tipoestado: { type: String, required: [true, "Indique la tipoestado"] },
        propiedadocupada: { type: Boolean, required: [true, "Indique la propiedadocupada"] },
        fondoirregular: { type: Boolean, required: [true, "Indique la fondoirregular"] },
        frenteirregular: { type: Boolean, required: [true, "Indique la frenteirregular"] },
        demolicion: { type: Boolean, required: [true, "Indique la demolicion"] },
        lateralizquierdoirregular: { type: Boolean, required: [true, "Indique la lateralizquierdoirregular"] },
        lateralderechoirregular: { type: Boolean, required: [true, "Indique la lateralderechoirregular"] },
        tipoinstalaciones: { type: [String], required: [true, "Indique la tipoinstalaciones"] },
        tiposervicios: { type: [String], required: [true, "Indique la tiposervicios"] },

        // recibe un objeto de JS
        terraza: { type: String, required: [true, "falta terraza"] }
    },
    { collection: "detalles" }
);

module.exports = mongoose.model("Detalle", detallesSchema);
