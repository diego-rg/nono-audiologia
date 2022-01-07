//Schema para os sons da nosa DB nono
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SoundSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    minFrec: {
        type: Number,
        required: true,
        min: [20, "El valor de la frecuencia debe estar entre 20 y 20.000 Hz"],
        max: [20000, "El valor de la frecuencia debe estar entre 20 y 20.000 Hz"]
    },
    maxFrec:{
        type: Number,
        required: true,
        min: [20, "El valor de la frecuencia debe estar entre 20 y 20.000 Hz"],
        max: [20000, "El valor de la frecuencia debe estar entre 20 y 20.000 Hz"]
    },
    minInt:{
        type: Number,
        required: true,
        min: [0, "El valor de la intensidad debe estar entre 0 y 200 dB"],
        max: [200, "El valor de la intensidad debe estar entre 0 y 200 dB"]
    },
    maxInt:{
        type: Number,
        required: true,
        min: [0, "El valor de la intensidad debe estar entre 0 y 200 dB"],
        max: [200, "El valor de la intensidad debe estar entre 0 y 200 dB"]
    },
    category: {
        type: String,
        required: true,
        enum: ["Hogar", "Naturaleza", "Conversación", "Ocio", "Lugares", "Ciudad"]
    },
    audio: {
        type: String
    },
    image: {
        type: String
    }
});

const Sound = mongoose.model("Sound", SoundSchema);//Gardamos o modelo nunha constante para exportalo xunto as categorías

const Categs = Sound.schema.path('category').enumValues;//Sacamos o valor das categorías para o noso índice
const Categories = Categs.sort();//Orden alfabético

module.exports = { Sound, Categories };//Así podemos exportar as dúas co esta sintaxis, coa outra solo exportaba o modelo