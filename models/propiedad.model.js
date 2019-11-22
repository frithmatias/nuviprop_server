var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var propiedadSchema = new Schema(
  {

    // recibe un objeto de JS
    operacion: { type: String, required: [true, "El tipo de operación es necesaria"] },
    tipopropiedad: { type: String, required: [true, "El tipo de propiedad es necesario"] },
    pais: { type: String, required: [true, "El pais es necesario"] },
    provincia: { type: String, required: [true, "La provincia es necesaria"] },
    ciudad: { type: String, required: [true, "La ciudad es necesaria"] },
    barrio: { type: String, required: [true, "El barrio es necesario"] },
    calle: { type: String, required: [true, "La calle es necesaria"] },
    numero: { type: Number, required: [true, "El numero es necesario"] },
    imgs: { type: [String], required: false },
    descripcion: { type: String, required: false },
    ambientes: { type: Number, required: false },
    dormitorios: { type: Number, required: false },
    terraza: { type: Boolean, required: false },
    zonificacion: { type: String, required: false },
    ambienteslista: { type: String, required: false },
    serviciosbasicos: { type: String, required: false },
    serviciosgenerales: { type: String, required: false },
    expensas: { type: Number, required: false },
    banios: { type: Number, required: false },
    cocheras: { type: Number, required: false },
    aptocredito: { type: Boolean, required: false },
    antiguedad: { type: Number, required: false },
    techo: { type: String, required: false },
    estado: { type: String, required: false },
    disposicion: { type: String, required: false },
    orientacion: { type: String, required: false },

    precio: { type: Number, required: false },
    dolares: { type: Boolean, required: false },
    supcubierta: { type: Number, required: false },
    supdescubierta: { type: Number, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    inmobiliaria: {
      type: Schema.Types.ObjectId,
      ref: 'Inmobiliaria',
      required: [true, 'El id inmobiliaria es un campo obligatorio ']
    }
  },
  { collection: "propiedades" }
);

module.exports = mongoose.model("Propiedad", propiedadSchema);
