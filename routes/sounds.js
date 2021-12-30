const express = require("express");
const router = express.Router();

//Ver todas as categorías
// router.get("/categories", catchAsync(async (req, res) => {
//     const categs = await Categories;
//     res.render("sounds/categories", { categs });
// }));

//INDEX ROUTE. Ver todos os sons
router.get("/", catchAsync(async (req, res, next) => {
    const sounds = await Sound.find({}).sort({ name: "asc"});//Añadimos sort para orden alfabético
    res.render("sounds/sounds", { sounds });
}));

//NEW ROUTE. Envía a form para crear sons
router.get("/new", (req, res) => {
    res.render("sounds/new", { Categories });
});
//CREATE ROUTE. Crea un novo son no server
router.post("/", joiValidation, catchAsync(async (req, res) => {
    // if(!req.body.sound) throw new ExpressError("Los datos introducidos no son válidos", 400);//Por si salta a validación da form (ej: usando postman)
    const sound = new Sound(req.body.sound);//requiere extended: true
    await sound.save();
    res.redirect(`/sounds/${sound._id}`);
}));

//Ver sons de cada categoría
// router.get("/:category", catchAsync(async (req, res) => {
//     const sounds = await Sound.find({ category: req.params.category }).sort({ name: "asc"});//Añadimos sort para orden alfabético
//     const CategSounds = req.params.category;//Pasamos como variable a categoría que corresponde para eseñala no correspondente ejs
//     res.render("sounds/category", { sounds, CategSounds });
// }));

//SHOW ROUTE. Ver cada son
router.get("/show/:id", catchAsync(async (req, res, next) => {
    const sound = await Sound.findById(req.params.id);
    res.render("sounds/show", { sound });
}));

//EDIT ROUTE. Envía a form para editar sons
router.get("/sounds/show/:id/edit", catchAsync(async (req, res) => {
    const sound = await Sound.findById(req.params.id);
    res.render("sounds/edit", { sound, Categories });
}));
//UPDATE ROUTE. Modifica o son no server. (PUT: "completo": envía un novo obxecto enteiro (se faltan datos quedan vacíos, devolve null (ej se falta name devolve name: null)).
//PATCH: "parcial": envía só o modificado (se non se inclúen todos os datos, usa os que había antes en vez de "mandalos vacíos coma PUT)). Neste caso PUT xa que modificamos todo na form?
router.put("/sounds/show/:id", joiValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const sound = await Sound.findByIdAndUpdate(id, { ...req.body.sound });
    res.redirect(`/sounds/show/${sound._id}`);
}));

//Delete
router.delete("/sounds/show/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Sound.findByIdAndDelete(id);
    res.redirect("/sounds");
}));

module.exports = router;