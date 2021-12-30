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
const soundsRoutes = require("./routes/sounds");//Importamos as rutas

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
app.use("/sounds", soundsRoutes);//Activamos as rutas

app.get("/home", (req, res) => {
    res.render("sounds/home");
});

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