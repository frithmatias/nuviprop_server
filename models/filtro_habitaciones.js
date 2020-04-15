var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cantidadHabitaciones = new Schema(
    {

        // recibe un objeto de JS
        nombre: { type: String, required: false },
        id: { type: String, required: false }

    },
    { collection: "filtro_habitaciones" }
);

module.exports = mongoose.model("Habitaciones", cantidadHabitaciones);
