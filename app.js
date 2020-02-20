// ==================================================
// Requires
// ==================================================
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");

// ==================================================
// Inicializar variables
// ==================================================
var app = express();


// ==================================================
// Morgan
// ==================================================
var morgan = require("morgan");
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));




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
var avisosRoutes = require("./routes/avisos.routes");
var inmobiliariasRoutes = require("./routes/inmobiliarias.routes");
var busquedaRoutes = require('./routes/buscar.routes');
var uploadsRoutes = require("./routes/uploads.routes");
var imagenesRoutes = require("./routes/imagenes.routes");
var formsRoutes = require("./routes/forms.routes");
var inicioRoutes = require("./routes/inicio.routes");
// var appRoutes = require('./routes/app');

// ==================================================
// Asignar Rutas
// ==================================================
app.use("/login", loginRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/avisos", avisosRoutes);
app.use("/inmobiliarias", inmobiliariasRoutes);
app.use('/buscar', busquedaRoutes);
app.use("/uploads", uploadsRoutes);
app.use("/imagenes", imagenesRoutes);
app.use("/forms", formsRoutes);
app.use("/inicio", inicioRoutes);

// app.use('/', appRoutes);

// ==================================================
// Conexión a la base de datos.
// ==================================================
const connectionString = '***REMOVED***';
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose
   .connect('***REMOVED***', { useNewUrlParser: true })
  // .connect(connectionString, { useNewUrlParser: true }, err => err ? console.log(err) : console.log('ok'))
  .then(() => {
    console.log('MongoDB corriendo en el puerto 27017: \x1b[32m%s\x1b[0m', 'ONLINE');
  })
  .catch((err) => {
    throw err;
  });


// ==================================================
// Inicializar el servidor puerto 3000
// ==================================================
const port = process.env.PORT || 3000;
// Escuchar peticiones
app.listen(port, () => {
  console.log("Express Server corriendo en el puerto " + port + ": \x1b[32m%s\x1b[0m","ONLINE");
});

/*
Que es lo mismo que
app.listen(3000, function(){

})
*/
