const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const Joi = require("joi");//Non faría falta xa ao usalo e exportalo de validationSchemas
const { Sound, Categories } = require("./models/sound");//Requerimos as dúas constantes de sound (para modelo e categorías)
const joiSoundSchema = require("./validationSchemas");

mongoose.connect('mongodb://localhost:27017/nono', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!")
        console.log(err)
    })

const app = express();

app.engine("ejs", ejsMate);//Para usar o egine de ejs e non o default
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));//Para req.body en CREATE
app.use(methodOverride("_method"));//Para poder crear DELETE e UPDATE/EDIT

//Sacamos a validación Server-Side con Joi para unha función e pasámola nas rutas de post e editar
const joiValidation = (req, res, next) => {
    const validation = joiSoundSchema.validate(req.body);
    if(validation.error) {
        const errorMsg = validation.error.details.map(msg => msg.message).join(",");//Como Joi mete os detalles do error nun array de objetos, hai q sacalo para enseñalo
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    };
};

app.get("/home", (req, res) => {
    res.render("sounds/home");
});

//Ver todas as categorías
app.get("/categories", catchAsync(async (req, res) => {
    const categs = await Categories;
    res.render("sounds/categories", { categs });
}));

//Ver todos os sons
app.get("/sounds", catchAsync(async (req, res, next) => {
    const sounds = await Sound.find({}).sort({ name: "asc"});//Añadimos sort para orden alfabético
    res.render("sounds/sounds", { sounds });
}));

//CREATE: Debe ir antes de ver todos e ver categoria para non dar problemas
app.get("/sounds/new", (req, res) => {
    res.render("sounds/new", { Categories });
});

app.post("/sounds", joiValidation, catchAsync(async (req, res) => {
    // if(!req.body.sound) throw new ExpressError("Los datos introducidos no son válidos", 400);//Por si salta a validación da form (ej: usando postman)
    const sound = new Sound(req.body.sound);//requiere extended: true
    await sound.save();
    res.redirect(`/sounds/show/${sound._id}`);
}));

//Ver sons de cada categoría
app.get("/sounds/:category", catchAsync(async (req, res) => {
    const sounds = await Sound.find({ category: req.params.category }).sort({ name: "asc"});//Añadimos sort para orden alfabético
    const CategSounds = req.params.category;//Pasamos como variable a categoría que corresponde para eseñala no correspondente ejs
    res.render("sounds/category", { sounds, CategSounds });
}));

//Ver cada son. Ten que ter diferente ruta que categorías
app.get("/sounds/show/:id", catchAsync(async (req, res, next) => {
    const sound = await Sound.findById(req.params.id);
    res.render("sounds/show", { sound });
}));

//EDIT
app.get("/sounds/show/:id/edit", catchAsync(async (req, res) => {
    const sound = await Sound.findById(req.params.id);
    res.render("sounds/edit", { sound, Categories });
}));

app.put("/sounds/show/:id", joiValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const sound = await Sound.findByIdAndUpdate(id, { ...req.body.sound });
    res.redirect(`/sounds/show/${sound._id}`);
}));

//Delete
app.delete("/sounds/show/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Sound.findByIdAndDelete(id);
    res.redirect("/sounds");
}));

//Error 404 para TODOS os path que non existen (NON conta as ids, solo path base). Debe ir ao final. COn next pasa ao siguiente
app.all("*", (req, res, next) => {
    next(new ExpressError("La página que buscas no existe", 404));
});

//Base error handler. Encadena desde o anterior app.all. Levan valores por defecto por si acaso, no caso de message é condicional
app.use((err, req, res, next) => {
    const { status = 500 } = err;
   if(!err.message) err.message = "Ha habido un problema al cargar la página";
    res.status(status).render("errorTemplate", { err });
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});