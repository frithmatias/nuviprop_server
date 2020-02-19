var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var uniqueValidator = require("mongoose-unique-validator");

var rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido"
};

var usuarioSchema = new Schema({
  email: { type: String, required: [true, "El correo es necesario"], unique: true },
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  ubicacion: { type: String, required: false, default: null },
  password: { type: String, required: [true, "El password es necesario"] },
  img: { type: String, required: false, default: "no-img.jpg" },
  role: { type: String, required: false, default: "USER_ROLE", enum: rolesValidos },
  favoritos: { type: [String], required: false },
  google: { type: Boolean, default: false },
  lastlogin: { type: Date, registered: false },
  registered: { type: Date, default: new Date()
  }
});

usuarioSchema.plugin(uniqueValidator, {
  message: "El {PATH} debe de ser unico"
});

module.exports = mongoose.model("Usuario", usuarioSchema);
