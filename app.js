// ==================================================
// Requires
// ==================================================
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// ==================================================
// Inicializar variables
// ==================================================
var app = express();

// ==================================================
// EJEMPLO DE MQTT (npm i mqtt)
// ==================================================
// var mqtt = require("mqtt");
// var client = mqtt.connect("wxs://test.mosquitto.org");

// var conectado;
// client.on("connect", function() {
//   client.subscribe("presence", function(err) {
//     if (!err) {
//       client.publish("presence", "Hello mqtt");
//     }
//   });
//   var conectado = true;
// });
// client.on("message", function(topic, message) {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });

// ==================================================
// MIDDLEWARE CORS
// ==================================================

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// .USE() es un MIDDLEWARE, cualquier petición que llegue primero va a pasar por esta función.
// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express-fileupload
var fileUpload = require("express-fileupload");
app.use(fileUpload());

// ==================================================
// Importar Rutas
// ==================================================
var loginRoutes = require("./routes/login.routes");
var userRoutes = require("./routes/user.routes");
var propiedadRoutes = require("./routes/propiedad.routes");
// var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require("./routes/upload.routes");
var imagenesRoutes = require("./routes/imagenes.routes");
// var appRoutes = require('./routes/app');

// ==================================================
// Asignar Rutas
// ==================================================
app.use("/login", loginRoutes);
app.use("/user", userRoutes);
app.use("/propiedad", propiedadRoutes);
// app.use('/busqueda', busquedaRoutes);
app.use("/upload", uploadRoutes);
app.use("/imagenes", imagenesRoutes);
// app.use('/', appRoutes);

// ==================================================
// Conexión a la base de datos.
// ==================================================
mongoose.connection.openUri("***REMOVED***", (err, res) => {
  if (err) throw err;
  console.log(
    "MongoDB corriendo en el puerto 27017: \x1b[32m%s\x1b[0m",
    "ONLINE"
  );
}); // Segundo argumento es una función de callback.

// Escuchar peticiones
app.listen(3000, () => {
  console.log(
    "Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m",
    "ONLINE"
  );
});

/*
Que es lo mismo que 
app.listen(3000, function(){

})
*/
