var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var avisoSchema = new Schema(
  {

    // recibe un objeto de JS
    calle: { type: String, required: [true, "El dato calle es necesario"] },
    altura: { type: Number, required: [true, "El dato altura es necesario"] },
    piso: { type: Number, required: false },
    depto: { type: String, required: false },
    titulo: { type: String, required: [true, "El dato titulo es necesario"] },
    descripcion: { type: String, required: [true, "El dato descripcion del aviso es necesario"] },
    precio: { type: Number, required: [true, "El dato precio del aviso es necesario"] },
    moneda: { type: String, required: [true, "El dato radiogroup_moneda del aviso es necesario"] },
    nopublicarprecio: { type: Boolean, required: [true, "El dato no_publicar_precio del aviso es necesario"] },
    aptocredito: { type: Boolean, required: [true, "El dato apto_credito del aviso es necesario"] },
    codigopostal: { type: String, required: [true, "El dato codigopostal del aviso es necesario"] },
    imgs: [{ type: String, required: false }],
    activo: { type: Boolean, required: [true, "El backend no definio el estado activo/inactivo del aviso"] },

    tipoinmueble: { type: Schema.Types.ObjectId, ref: 'Inmuebles', required: [true, "El id del tipo de inmueble es un campo obligatorio"] },
    tipounidad: { type: Schema.Types.ObjectId, ref: 'Unidades', required: [true, "El id del tipo de unidad es un campo obligatorio"] },
    tipooperacion: { type: Schema.Types.ObjectId, ref: 'Operaciones', required: [true, "El id del tipo de operacion es un campo obligatorio"] },
    localidad: { type: Schema.Types.ObjectId, ref: 'Localidad', required: [true, "El id de la localidad es un campo obligatorio"] },
    detalles: { type: Schema.Types.ObjectId, ref: 'Detalle', required: [false] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, "El id del usuario es un campo obligatorio"] },
    // inmobiliaria: { type: Schema.Types.ObjectId, ref: 'Inmobiliaria', required: [true, 'El id de la inmobiliaria es un campo obligatorio'] },
  },
  { collection: "avisos" }
);

module.exports = mongoose.model("Aviso", avisoSchema);
