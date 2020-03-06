var fs = require("fs");
var path = require("path");

function createFolder(dirPath) {
    // ./uploads/aviso
    // ./uploads/usuario
    var pathUser = path.resolve(__dirname, '../', dirPath);
    var existe = fs.existsSync(pathUser);
    if (!existe) {
        console.log('creando ', pathUser);
        fs.mkdirSync(pathUser,{recursive: true}, err => {
            console.log(err);
        });
    }
    // return pathUserTemp;
}

function deleteFolder(dirPath) {
    const deleteFolderRecursive = function (dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file, index) => {
                const curPath = [dirPath, file].join('/');
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
        return (false);
    } else {
        return (true);
    }

}



module.exports = { createFolder, deleteFolder }