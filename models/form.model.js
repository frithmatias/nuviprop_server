var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var formSchema = new Schema(
    {

        // recibe un objeto de JS
        type: { type: String, required: false },
        name: { type: String, required: false },
        id: { type: String, required: false },
        label: { type: String, required: false },
        controls: [{ type: Object, required: false }]
    },
    { collection: "forms" }
);

module.exports = mongoose.model("Form", formSchema);
