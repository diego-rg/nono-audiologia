const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { Sound, Categories } = require("./models/sound");//Requerimos as dúas constantes de sound (para modelo e categorías)
const res = require("express/lib/response");

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

app.use(express.urlencoded({ extended: true }));//Para req.body en CREATE

// //Facer sons desde a web a mongo
// app.get("/makesound", async (req, res) => {
//     const sound = new Sound({name: "Can", minFrec: 500, maxFrec: 400, minInt: 40, maxInt: 50, category: "Naturaleza"});
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
    const sounds = await Sound.find({}).sort({ name: "asc"});//Añadimos sort para orden alfabético
    res.render("sounds/sounds", { sounds });
});

//CREATE: Debe ir antes de ver todos e ver categoria para non dar problemas
app.get("/sounds/new", (req, res) => {
    res.render("sounds/new", { Categories });
});

app.post("/sounds", async (req, res) => {
    const sound = new Sound(req.body.sound);//requiere extended: true
    await sound.save();
    res.redirect(`sounds/show/${sound._id}`);
});

//Ver sons de cada categoría
app.get("/sounds/:category", async (req, res) => {
    const sounds = await Sound.find({ category: req.params.category }).sort({ name: "asc"});//Añadimos sort para orden alfabético
    const CategSounds = req.params.category;//Pasamos como variable a categoría que corresponde para eseñala no correspondente ejs
    res.render("sounds/category", { sounds, CategSounds });
});

//Ver cada son. Ten que ter diferente ruta que categorías
app.get("/sounds/show/:id", async (req, res) => {
    const sound = await Sound.findById(req.params.id);
    res.render("sounds/show", { sound });
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});