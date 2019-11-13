var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==================================================
// Verificar TOKEN 
// ==================================================

exports.verificaToken = function(req, res, next) {

    // En la app de Ionic 4, de fotosGram, en el backend usa el metodo get para obtener el nombre 
    // de la propiedad en la que viene el token. 
    // const userToken = req.get('x-token' || '');
    // para mas info 
    // https://expressjs.com/es/api.html#req

    // req.query.token obtiene el token como parametro en la URL en POSTMAN lo envio en PARAMS y 
    // le concatena el token=al2afj23rñasfdk... en la URL pero yo no quiero enviarlo en la URL, 
    // voy a enviarlo en los Headers como 'x-token'

    //var token = req.query.token;
    const userToken = req.get('x-token' || '');
    jwt.verify(userToken, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ //401 UNAUTHORIZED
                ok: false,
                mensaje: 'Token Incorrecto',
                errors: err
            });
        }
        // usuario QUE HIZO la SOLICITUD, en el request.
        req.usuario = decoded.usuario;
        next();
    });
};

// ==================================================
// Verificar si tiene privilegios de ADMIN 
// ==================================================

exports.canUpdate = function(req, res, next) {
    console.log('VERIFICANDO SI ES ADMIN...');
    // Aca no vamos a usar el TOKEN porque yo ya se desde el middleware de verificaToken que el token ES valido.
    var user_request = req.usuario;
    var user_to_update = req.params.id; // -> app.put('/:id',
    if ( user_request.role === 'ADMIN_ROLE' || user_request._id === user_to_update) {
        console.log('Accion permitida, el usuario es role Admin, o apunta al mismo usuario.');
        next();
        return;
    } else {
        console.log('EL USUARIO ES ROLE USER...');
            return res.status(401).json({ //401 UNAUTHORIZED
                ok: false,
                mensaje: 'Token Incorrecto - el role no es ADMIN_ROLE',
                errors: {message: 'No puede ejecutar la accion solicitada, no posee permisos de administrador.'}
            });
    }
};