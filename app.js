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
// Hay varias maneras de solucionar el problema con los CORS
// https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-token"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});
// O bien instalando cors 
// $npm install cors 
// var cors = require("cors");
// app.use(cors({ origin: true, credentials: true }));



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
var usuariosRoutes = require("./routes/usuarios.routes");
var propiedadesRoutes = require("./routes/propiedades.routes");
// var busquedaRoutes = require('./routes/busqueda');
var uploadsRoutes = require("./routes/uploads.routes");
var imagenesRoutes = require("./routes/imagenes.routes");
// var appRoutes = require('./routes/app');

// ==================================================
// Asignar Rutas
// ==================================================
app.use("/login", loginRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/propiedades", propiedadesRoutes);
// app.use('/busqueda', busquedaRoutes);
app.use("/uploads", uploadsRoutes);
app.use("/imagenes", imagenesRoutes);
// app.use('/', appRoutes);

// ==================================================
// Conexión a la base de datos.
// ==================================================
mongoose.connection.openUri("mongodb://localhost:27017/inMob", (err, res) => {
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
