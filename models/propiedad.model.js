var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var propiedadSchema = new Schema(
  {

    // recibe un objeto de JS
    calle: { type: String, required: [true, "El dato calle es necesario"] },
    altura: { type: Number, required: [true, "El dato altura es necesario"] },
    piso: { type: Number, required: false },
    depto: { type: String, required: false },
    tipoinmueble: {
      nombre: { type: String, required: [true, "El dato nombre del tipoinmueble es necesario"] },
      id: { type: String, required: [true, "El dato id del tipoinmueble es necesario"] },
    },
    tipounidad: {
      nombre: { type: String, required: [true, "El dato nombre del tipounidad es necesario"] },
      id: { type: String, required: [true, "El dato id del tipounidad es necesario"] },
    }, tipooperacion: {
      nombre: { type: String, required: [true, "El dato nombre del tipooperacion es necesario"] },
      id: { type: String, required: [true, "El dato id del tipooperacion es necesario"] },
    },
    titulo: { type: String, required: [true, "El dato titulo es necesario"] },
    descripcion: { type: String, required: [true, "El dato descripcion de propiedad es necesario"] },
    precio: { type: Number, required: [true, "El dato precio de propiedad es necesario"] },
    moneda: { type: String, required: [true, "El dato radiogroup_moneda de propiedad es necesario"] },
    nopublicarprecio: { type: Boolean, required: [true, "El dato no_publicar_precio de propiedad es necesario"] },
    aptocredito: { type: Boolean, required: [true, "El dato apto_credito de propiedad es necesario"] },
    provincia: {
      nombre: { type: String, required: [true, "El dato nombre de la provincia es necesario"] },
      id: { type: String, required: [true, "El dato id de la provincia es necesario"] },
    },
    departamento: {
      nombre: { type: String, required: [true, "El dato nombre del departamento es necesario"] },
      id: { type: String, required: [true, "El dato id del departamento es necesario"] },
    },
    localidad: {
      nombre: { type: String, required: [true, "El dato nombre de la localidad es necesario"] },
      id: { type: String, required: [true, "El dato id de la localidad es necesario"] },
    },
    coords: {
      lat: { type: String, required: [true, "El dato lat de coords es necesario"] },
      lng: { type: String, required: [true, "El dato lng de coords es necesario"] },
    }, codigopostal: { type: String, required: [true, "El dato codigopostal de propiedad es necesario"] },
    imgs: [{ type: String, required: false }],
    activo: { type: Boolean, required: [true, "El backend no definio el estado activo/inactivo del aviso"] },

    detalles: { type: Schema.Types.ObjectId, ref: 'Detalle', required: [false] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, "El id del usuario es un campo obligatorio"] },
    // inmobiliaria: { type: Schema.Types.ObjectId, ref: 'Inmobiliaria', required: [true, 'El id de la inmobiliaria es un campo obligatorio'] },
  },
  { collection: "propiedades" }
);

module.exports = mongoose.model("Propiedad", propiedadSchema);
