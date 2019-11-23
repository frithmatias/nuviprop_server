var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;



// app.use(morgan('combined'));
//app.use(morgan('tiny'));
//morgan(':method :url :status :res[content-length] - :response-time ms')


// ==================================================
// Verificar TOKEN
// ==================================================

// app.use('/', (req, res, next) => {
// });

exports.verificaToken = function (req, res, next) {
  // Acá SI vamos a usar el NEXT.
  // var token = req.query.token;
  const token = req.get('x-token' || '');
  // Aca vamos a usar otra vez el SEED (semilla) o la clave secreta, para facilitar el acceso a una constante
  // vamos a ponerla dentro de una carpeta y archivo que vamos a crear con nombre CONFIG/CONFIG.JS.
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        //401 UNAUTHORIZED
        ok: false,
        mensaje: "Token Incorrecto",
        errors: err
      });
    }

    // Con esta instrucción vamos a tener la información del usuario QUE HIZO la SOLICITUD, en el request.
    req.usuario = decoded.usuario;
    /*
        console.log(decoded);
        devuelve objeto decoded:

        { usuario:
            { role: 'ADMIN_ROLE',
                _id: '5c66e86d2ccf0904306d3925',
                nombre: 'Matias',
                email: 'prueba@pruesba.com',
                password:
                '$2a$10$c6RUvqZUWrlah6r5AOLro.Y5XD7uqVbtryrG0jNQ91c.y4FSSU6g.',
                __v: 0 },
            iat: 1550318754,
            exp: 1550333154 
        }
        
        */

    next();

    // return res.status(200).json({ //401 UNAUTHORIZED
    //     ok: true,
    //     decoded: decoded
    // });
  });
};

exports.canUpdate = function (req, res, next) {
  console.log("VERIFICANDO SI ES ADMIN...");
  // Aca no vamos a usar el TOKEN porque yo ya se desde el middleware de verificaToken que el token ES valido.

  var user_request = req.usuario;
  var user_to_update = req.params.id; // -> app.put('/:id',

  if (
    user_request.role === "ADMIN_ROLE" ||
    user_request._id === user_to_update
  ) {
    console.log(
      "Accion permitida, el usuario es role Admin, o apunta al mismo usuario."
    );

    next();
    return;
  } else {
    console.log("EL USUARIO ES ROLE USER...");
    return res.status(401).json({
      //401 UNAUTHORIZED
      ok: false,
      mensaje: "Token Incorrecto - el role no es ADMIN_ROLE",
      errors: {
        message:
          "No puede ejecutar la accion solicitada, no posee permisos."
      }
    });
  }
};
