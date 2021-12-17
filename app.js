const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Sound = require("./models/sound");
const { render } = require("express/lib/response");

mongoose.connect('mongodb://localhost:27017/nono', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!")
        console.log(err)
    })

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/makesound", async (req, res) => {
    const sound = new Sound({name: "Teclado", minFrec: 1000, maxFrec: 2000, minInt: 50, maxInt: 60, category: "ocio"});
    await sound.save();
    res.send(sound);

})

app.get("/", (req, res) => {
    res.render("proba");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});