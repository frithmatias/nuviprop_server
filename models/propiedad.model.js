var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var propiedadSchema = new Schema(
  {
    // recibe un objeto de JS
    zonificacion: {
      type: String,
      ref: "Zonificacion",
      required: [true, "La zonificacion es necesaria"]
    },
    pais: {
      type: String,
      ref: "Pais",
      required: [true, "El pais es necesario"]
    },
    provincia: {
      type: String,
      ref: "Provincia",
      required: [true, "La provincia es necesaria"]
    },
    ciudad: {
      type: String,
      ref: "Ciudad",
      required: [true, "La ciudad es necesaria"]
    },
    barrio: {
      type: String,
      ref: "Barrio",
      required: [true, "El barrio es necesario"]
    },
    tipopropiedad: {
      type: String,
      ref: "TipoPropiedad",
      required: [true, "El tipo de propiedad es necesario"]
    },
    calle: { type: String, required: [true, "La calle es necesaria"] },
    numero: { type: Number, required: [true, "El numero es necesario"] },
    descripcion: {
      type: String,
      required: [true, "La descripcion es necesaria"]
    },
    dormitorios: { type: Number, required: true },
    ambientes: {
      type: Number,
      required: [true, "Los ambientes son necesarios"]
    },
    ambienteslista: {
      type: String,
      ref: "AmbientesLista",
      required: [true, "Debe existir una lista de ambientes"]
    },
    serviciosbasicos: {
      type: String,
      ref: "ServiciosBasicos",
      required: [true, "Debe existir una lista de servicios básicos"]
    },
    serviciosgenerales: {
      type: String,
      ref: "ServiciosGenerales",
      required: [true, "Debe existir una lista de servicios generales"]
    },
    expensas: { type: Number, required: [true, "Las expensas son necesarias"] },
    banios: {
      type: Number,
      required: [true, "La cantidad de baños es necesaria"]
    },
    cocheras: {
      type: Number,
      required: [true, "La cantidad de cocheras son necesarias"]
    },
    terraza: { type: Boolean, required: false, default: null },
    aptocredito: {
      type: Boolean,
      required: [true, "El aptocredito es necesario"]
    },
    antiguedad: { type: Number, required: false },
    techo: {
      type: String,
      ref: "TipoTecho",
      required: [true, "El techo es necesario"]
    },
    estado: {
      type: String,
      ref: "Estado",
      required: [true, "El estado es necesario"]
    },
    disposicion: {
      type: String,
      ref: "Disposicion",
      required: [true, "La disposicion es necesaria"]
    },
    operacion: {
      type: String,
      ref: "Operacion",
      required: [true, "El tipo de operación es necesaria"]
    },
    precio: { type: Number, required: [true, "El precio es necesario"] },
    dolares: {
      type: Boolean,
      required: [true, "El Tipo de moneda es necesaria"]
    },
    supcubierta: {
      type: Number,
      required: [true, "La superficie cubierta es necesaria"]
    },
    supdescubierta: {
      type: Number,
      required: [true, "La superficie descubierta es necesaria"]
    },
    imgs: { type: [String], required: false }
  },
  { collection: "propiedades" }
);

module.exports = mongoose.model("Propiedad", propiedadSchema);
