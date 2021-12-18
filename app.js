const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { Sound, Categories } = require("./models/sound");//Requerimos as dúas constantes de sound (para modelo e categorías)

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


//Facer sons desde a web a mongo
// app.get("/makesound", async (req, res) => {
//     const sound = new Sound({name: "Teclado", minFrec: 1000, maxFrec: 2000, minInt: 50, maxInt: 60, category: "ocio"});
//     await sound.save();
//     res.send(sound);

// })


//Ver todas as categorías
app.get("/categories", async (req, res) => {
    const categs = await Categories;
    res.render("sounds/categories", { categs });
});

//Ver todos os sons
app.get("/sounds", async (req, res) => {
    const sounds = await Sound.find({}).sort({ name: 'asc'});//Añadimos sort para orden alfabético
    res.render("sounds/sounds", { sounds });
});

//Ver sons de cada categoría
app.get("/sounds/:category", async (req, res) => {
    const sounds = await Sound.find({ category: 'Ocio' }).sort({ name: 'asc'});//Añadimos sort para orden alfabético
    console.log(req.params.category);
    console.log(sounds);
    res.render("sounds/category", { sounds });
});

//Ver cada son
app.get("/sounds/show/:id", async (req, res) => {
    const sound = await Sound.findById(req.params.id);
    res.render("sounds/show", { sound });
})


app.listen(3000, () => {
    console.log("Listening on port 3000");
});