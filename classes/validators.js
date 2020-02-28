
// var AvisoModel = require('../models/aviso');

class Validators {

    constructor() {
        this.texto = '';
    }

    capitalize() {
        texto = texto.toLowerCase();
        const palabras = texto.split(' ');
        nombres.forEach((nombre, i) => {
            nombres[i] = nombres[i][0].toUpperCase() + nombres[i].substr(1); // .substr(1) concateno desde la primera posición en adelante
        });
        return nombres.join(' ');
    }

}