var fs = require("fs");
var path = require("path");

function createFolder(dirPath) {
    // ./uploads/aviso
    // ./uploads/usuario
    var pathUser = path.resolve(__dirname, '../', dirPath);
    var existe = fs.existsSync(pathUser);
    if (!existe) {
        fs.mkdirSync(pathUser);
    }
    // return pathUserTemp;
}

function deleteFolder(dirPath) {
    const deleteFolderRecursive = function (dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file, index) => {
                const curPath = [dirPath, file].join('/');
                console.log('borrando archivo: ', curPath);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirPath);
        }
    };
    deleteFolderRecursive(dirPath);
    if (fs.existsSync(dirPath)) {
        console.log('No se pudo borrar la carpeta que contiene las imagenes del aviso!');
        return (false);
    } else {
        console.log('Carpeta borrada correctamente.');
        return (true);
    }

}



module.exports = { createFolder, deleteFolder }