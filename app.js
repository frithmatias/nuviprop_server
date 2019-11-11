// ==================================================
// Requires
// ==================================================
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// ==================================================
// Inicializar variables
// ==================================================
var app = express();

// ==================================================
// MIDDLEWARE CORS
// ==================================================

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });

// .USE() es un MIDDLEWARE, cualquier petición que llegue primero va a pasar por esta función.
// Body Parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ==================================================
// Importar Rutas 
// ==================================================
var loginRoutes = require('./routes/login.routes');
var userRoutes = require('./routes/user.routes');
// var propiedadRoutes = require('./routes/propiedad');
// var busquedaRoutes = require('./routes/busqueda');
// var uploadRoutes = require('./routes/upload');
// var imagenesRoutes = require('./routes/imagenes');
// var appRoutes = require('./routes/app');

// ==================================================
// Asignar Rutas
// ==================================================
app.use('/login', loginRoutes);
app.use('/user', userRoutes);
// app.use('/propiedad', propiedadRoutes);
// app.use('/busqueda', busquedaRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/imagenes', imagenesRoutes);
// app.use('/', appRoutes);

// ==================================================
// File Server index config
// ==================================================
// var serveIndex = require('serve-index');
// para poder ver las imagenes, si comento esta linea me devuelve Cannot GET /uploads/hospitales/5c68069aa4ab291fc4a0f5af-516.jpg
// app.use(express.static(__dirname + '/')) 
// para poder navegar carpetas dentro de /uploads
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// ==================================================
// Conexión a la base de datos.
// ==================================================
mongoose.connection.openUri('mongodb://localhost:27017/inMob', (err, res) => {

if (err) throw err;
console.log('MongoDB corriendo en el puerto 27017: \x1b[32m%s\x1b[0m', 'ONLINE');

} ); // Segundo argumento es una función de callback.


// Escuchar peticiones 
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'ONLINE');
});

/*
Que es lo mismo que 
app.listen(3000, function(){

})
*/
