const path = require('path'); // para definir el path de una imagen
const fs = require('fs'); // para verificar si la imagen existe
var fileSystem = require("./filesystem.controller");

const http = require('http');
// getImage para obtener imagenes en un BACKEND con storage

function getImage2(req, res) {
	var tipo = req.params.tipo;
	var id = req.params.id;
	var img = req.params.img;
	var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${id}/${img}`);
	if (fs.existsSync(pathImage)) {
		res.sendFile(pathImage);
	} else {
		var pathNoImage = path.resolve(__dirname, '../assets/img/no-img.jpg');
		res.sendFile(pathNoImage);
	}
	// Ahora si para ver la imgen por HTTP 
	// http://localhost:3000/imagenes/usuarios/5dc87bd8d5756a191422c938/5dc87bd8d5756a191422c938-88.png
}

// El backend obtiene las imagnes de otro sitio 
// frontend <- [HTTP] <- backend <- [FTP] <- hostinger
async function getImage(req, res) {
	var tipo = req.params.tipo;
	var id = req.params.id;
	var img = req.params.img;



	var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${id}/${img}`);
	if (fs.existsSync(pathImage)) {
		res.sendFile(pathImage);
	} else {
		// si no existe puede ser que sea una solicitud apra mostrar una imagen por defecto.
		if (['no-img.jpg', 'xxx'].includes(img)) {
			var pathNoImage = path.resolve(__dirname, '../assets/img/no-img.jpg');
			res.sendFile(pathNoImage);
		} else {

			// Si no esta en heroku y no solicita la imagen por defecto, entonces la busco en Hostinger
			await downloadHTTP(tipo, id, img).then(() => {
				// downloadHTTP guarda la imagen solicitada en la carpeta solicitada en Heroku y la devuelve
				if (fs.existsSync(pathImage)) {
					res.sendFile(pathImage);
				}
			}).catch(err => {
				console.log(err);
			});
		}
	}








	// Ahora si para ver la imgen por HTTP 
	// http://localhost:3000/imagenes/usuarios/5dc87bd8d5756a191422c938/5dc87bd8d5756a191422c938-88.png
}

// Si el archivo no existe en Heroku lo busco en Hostinger.
function downloadHTTP(tipo, id, img) {
	return new Promise((resolve, reject) => {
		if (tipo !== 'xxx') {
			// creo nuevamente la carpeta de usuario en Heroku
			fileSystem.createFolder(`./uploads/${tipo}/${id}`);

			// hago la descarga de la imágen solicitada a heroku pero en Hostinger
			const url = `http://www.nuviprop.com/uploads/${tipo}/${id}/${img}`;

			var download = (url, dest) => {
				var file = fs.createWriteStream(dest);
				var request = http.get(url, (response) => {
					response.pipe(file);
					file.on('finish', () => {
						file.close(resolve('finalizo')); // close() is async, call cb after close completes.
					});
					file.on('error', () => {
						file.close(reject('file error')); // close() is async, call cb after close completes.
					});
				}).on('error', (err) => { // Manejo el error
					fs.unlink(dest); // elimino el archivo asincronamente
					reject(err.message);
				});
			};

			download(url, `./uploads/${tipo}/${id}/${img}`);

		}
	});

}

module.exports = { getImage };