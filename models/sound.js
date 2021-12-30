//Schema para os sons da nosa DB nono
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SoundSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    minFrec: {
        type: Number,
        required: true
    },
    maxFrec:{
        type: Number,
        required: true
    },
    minInt:{
        type: Number,
        required: true
    },
    maxInt:{
        type: Number,
        required: true
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