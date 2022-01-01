//Schema para os sons da nosa DB nono
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SoundSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    minFrec: {
        type: Number,
        required: true,
        min: 20,
        max: 20000
    },
    maxFrec:{
        type: Number,
        required: true,
        min: 20,
        max: 20000
    },
    minInt:{
        type: Number,
        required: true,
        min: 0,
        max: 200
    },
    maxInt:{
        type: Number,
        required: true,
        min: 0,
        max: 200
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