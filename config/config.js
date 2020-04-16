// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


if (process.env.NODE_ENV === 'dev') {
    var dev = require('../config/config_dev');
    module.exports.SEED = dev.SEED;
    module.exports.GOOGLE_CLIENT_ID = dev.GOOGLE_CLIENT_ID;
    module.exports.GOOGLE_SECRET = dev.GOOGLE_SECRET; 
    module.exports.DB_CONSTR = dev.DB_CONSTR;
    module.exports.MAILER_USER = dev.MAILER_USER;
    module.exports.MAILER_PASS = dev.MAILER_PASS;
    module.exports.FTP_HOST = dev.FTP_HOST;
    module.exports.FTP_USER = dev.FTP_USER;
    module.exports.FTP_PASS = dev.FTP_PASS;
} else {
    module.exports.SEED = process.env.SEED;
    module.exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    module.exports.GOOGLE_SECRET = process.env.GOOGLE_SECRET; 
    module.exports.DB_CONSTR = process.env.DB_CONSTR;
    module.exports.MAILER_USER = process.env.MAILER_USER;
    module.exports.MAILER_PASS = process.env.MAILER_PASS;
    module.exports.FTP_HOST = process.env.FTP_HOST;
    module.exports.FTP_USER = process.env.FTP_USER;
    module.exports.FTP_PASS = process.env.FTP_PASS;
}

