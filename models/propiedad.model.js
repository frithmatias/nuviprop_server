var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var propiedadSchema = new Schema(
  {

    // recibe un objeto de JS
    calle: { type: String, required: [true, "El dato calle es necesario"] },
    altura: { type: Number, required: [true, "El dato altura es necesario"] },
    piso: { type: Number, required: false },
    depto: { type: String, required: false },
    tipoinmueble: { type: String, required: [true, "El dato tipo_inmueble es necesario"] },
    tipounidad: { type: String, required: [true, "El dato tipo_unidad es necesario"] },
    tipooperacion: { type: String, required: [true, "El dato tipo_operacion es necesario"] },
    titulo: { type: String, required: [true, "El dato titulo es necesario"] },
    descripcion: { type: String, required: [true, "El dato descripcion de propiedad es necesario"] },
    precio: { type: Number, required: [true, "El dato precio de propiedad es necesario"] },
    moneda: { type: String, required: [true, "El dato radiogroup_moneda de propiedad es necesario"] },
    nopublicarprecio: { type: Boolean, required: [true, "El dato no_publicar_precio de propiedad es necesario"] },
    aptocredito: { type: Boolean, required: [true, "El dato apto_credito de propiedad es necesario"] },
    pais: { type: String, required: [true, "El dato pais de propiedad es necesario"] },
    provincia: { type: String, required: [true, "El dato provincia de propiedad es necesario"] },
    partido: { type: String, required: [true, "El dato partido de propiedad es necesario"] },
    localidad: { type: String, required: [true, "El dato localidad de propiedad es necesario"] },
    barrio: { type: String, required: [true, "El dato barrio de propiedad es necesario"] },
    subbarrio: { type: String, required: [true, "El dato subbarrio de propiedad es necesario"] },
    codigopostal: { type: String, required: [true, "El dato codigopostal de propiedad es necesario"] },
    imgs: { type: [String], required: false },
    activo: { type: Boolean, required: [true, "El backend no definio el estado activo/inactivo del aviso"] },

    detalles: { type: Schema.Types.ObjectId, ref: 'Detalle', required: [false] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, "El id del usuario es un campo obligatorio"] },
    // inmobiliaria: { type: Schema.Types.ObjectId, ref: 'Inmobiliaria', required: [true, 'El id de la inmobiliaria es un campo obligatorio'] },
  },
  { collection: "propiedades" }
);

module.exports = mongoose.model("Propiedad", propiedadSchema);
