const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { Sound, Categories } = require("../models/sound");
const joiSoundSchema = require("../validationSchemas");

//Ver todas as categorías
router.get("/", catchAsync(async (req, res) => {
    const categs = await Categories;
    res.render("categories/categories", { categs });
}));

//Ver sons de cada categoría
router.get("/category", catchAsync(async (req, res) => {
    const sounds = await Sound.find({ category: req.params.category }).sort({ name: "asc"});//Añadimos sort para orden alfabético
    const categSounds = req.params.category;//Pasamos como variable a categoría que corresponde para eseñala no correspondente ejs
    res.render("categories/category", { sounds, categSounds });
}));

module.exports = router;