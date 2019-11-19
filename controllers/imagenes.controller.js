const path = require('path'); // para definir el path de una imagen
const fs = require('fs'); // para verificar si la imagen existe

// Rutas
//app.get('/:tipo/:img', (req, res, next) => {
function getImage(req, res) {
    console.log(req.params);
    var tipo = req.params.tipo;
    var id = req.params.id;
    var img = req.params.img;
    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${id}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/img/no-img.jpg');
        res.sendFile(pathNoImage);
    }
    // Ahora si para ver la imgen por HTTP 
    // http://localhost:3000/imagen/usuario/5c66e86d2ccf0904306d3925-885.jpg
}

module.exports = { getImage };