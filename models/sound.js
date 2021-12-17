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
        lowercase: true,
        required: true,
        enum: ["hogar", "naturaleza", "conversación", "ocio", "lugares", "ciudad"]
    }
});

module.exports = mongoose.model("Sound", SoundSchema);