const cloudinary = require('cloudinary').v2;
//Pasamos o código para eliminar archivos de cloudinary a unha función
//IMPORTANTE: schemaFile debe ter valor de sound.audio.filename ou sound.image.filename (do schema). fileType debe ter valor "video" ou "image" (types que soporta cloudinary)
async function destroyFiles (schemaFile, fileType) {
    await cloudinary.uploader.destroy(schemaFile, {//Eliminar mp3 de cloudinary. Debe eliminarse primeiro en cloud e logo o propio son da db Usa notación [] e .
        resource_type: fileType, invalidate: true,
    }, (err, result) => {
        console.log(err, result);
    });
}
module.exports = destroyFiles;