const express = require("express");
const router = express.Router();//En caso de ter avrias rutas, e que unha requira req.params de outra, hai que especificar express.Router({ mergeParams: true })
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { Sound, Categories } = require("../models/sound");
const joiSoundSchema = require("../validationSchemas");

//Sacamos a validación Server-Side con Joi para unha función e pasámola nas rutas de post e editar
const joiValidationSounds = (req, res, next) => {
    const validation = joiSoundSchema.validate(req.body);
    if(validation.error) {
        const errorMsg = validation.error.details.map(msg => msg.message).join(",");//Como Joi mete os detalles do error nun array de objetos, hai q sacalo para enseñalo
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    };
};

//INDEX ROUTE. Ver todos os sons
router.get("/", catchAsync(async (req, res, next) => {
    const sounds = await Sound.find({}).sort({ name: "asc"});//Añadimos sort para orden alfabético
    res.render("sounds/sounds", { sounds });
}));

//Ver todas as categorías
router.get("/categories", catchAsync(async (req, res) => {
    const categs = await Categories;
    res.render("sounds/categories", { categs });
}));

//Ver sons de cada categoría
router.get("/categories/:category", catchAsync(async (req, res) => {
    const sounds = await Sound.find({ category: req.params.category }).sort({ name: "asc"});//Añadimos sort para orden alfabético
    const soundCategory = req.params.category;//Pasamos como variable a categoría que corresponde para eseñala no correspondente ejs
    res.render("sounds/category", { sounds, soundCategory });
}));

//NEW ROUTE. Envía a form para crear sons
router.get("/new", (req, res) => {
    res.render("sounds/new", { Categories });
});
//CREATE ROUTE. Crea un novo son no server
router.post("/", joiValidationSounds, catchAsync(async (req, res) => {
    // if(!req.body.sound) throw new ExpressError("Los datos introducidos no son válidos", 400);//Por si salta a validación da form (ej: usando postman)
    const sound = new Sound(req.body.sound);//requiere extended: true
    await sound.save();
    req.flash("success", "Se ha añadido un nuevo sonido");//Mensaxe flash ao crear son correctamente. Hai que pasala pola páxina a onde redirixe a ruta para vela (...:id)
    res.redirect(`/sounds/categories/:category/${sound._id}`);
}));

//SHOW ROUTE. Ver cada son
router.get("/categories/:category/:id", catchAsync(async (req, res, next) => {
    const sound = await Sound.findById(req.params.id);
    const soundCategory = req.params.category;
    res.render("sounds/show", { sound, soundCategory }); //Habería que pasar o flasha aquí con , msg: req.flash("success") , pero mellor usar middle
}));

//EDIT ROUTE. Envía a form para editar sons
router.get("/categories/:category/:id/edit", catchAsync(async (req, res) => {
    const sound = await Sound.findById(req.params.id);
    const soundCategory = req.params.category;
    res.render("sounds/edit", { sound, Categories, soundCategory });
}));
//UPDATE ROUTE. Modifica o son no server. Usa post modificado con method-override. (PUT: "completo": envía un novo obxecto enteiro (se faltan datos quedan vacíos, devolve null (ej se falta name devolve name: null)).
//PATCH: "parcial": envía só o modificado (se non se inclúen todos os datos, usa os que había antes en vez de "mandalos vacíos coma PUT)). Neste caso PUT xa que modificamos todo na form?
router.put("/categories/:category/:id", joiValidationSounds, catchAsync(async (req, res) => {
    const { id } = req.params;
    const sound = await Sound.findByIdAndUpdate(id, { ...req.body.sound });
    res.redirect(`/sounds/categories/:category/${sound._id}`);
}));

//DESTROY ROUTE. Elimina un son. Usa post modificado con method-override.
router.delete("/categories/:category/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Sound.findByIdAndDelete(id);
    res.redirect("/sounds");
}));

module.exports = router;