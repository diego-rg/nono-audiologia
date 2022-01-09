const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();//En caso de ter varias rutas, e que unha requira req.params de outra, hai que especificar express.Router({ mergeParams: true })
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { Sound, Categories } = require("../models/sound");
const joiSoundSchema = require("../validationSchemas");
const  { isLoggedIn, joiValidationSounds, isAuthor } = require("../middleware");//Se non se garda co const =... hay que destructurar
const sounds = require("../controllers/sounds");//reestructuramos as rutas pasándoas ao seu propio archivo en controllers

//ROUTES:
//INDEX ROUTE. Ver todos os sons
router.get("/", catchAsync(sounds.index));//reestructuradas en controllers

//Ver todas as categorías
router.get("/categories", catchAsync(sounds.categories));

//Ver sons de cada categoría
router.get("/categories/:category", catchAsync(sounds.category));

//NEW ROUTE. Envía a form para crear sons
router.get("/new", isLoggedIn, sounds.newForm);

//CREATE ROUTE. Crea un novo son no server
router.post("/", isLoggedIn, joiValidationSounds, catchAsync(sounds.newSound));

//SHOW ROUTE. Ver cada son
router.get("/categories/:category/:id", catchAsync(sounds.showSound));

//EDIT ROUTE. Envía a form para editar sons
router.get("/categories/:category/:id/edit", isLoggedIn, isAuthor, catchAsync(sounds.editForm));

//UPDATE ROUTE. Modifica o son no server. Usa post modificado con method-override. (PUT: "completo": envía un novo obxecto enteiro (se faltan datos quedan vacíos, devolve null (ej se falta name devolve name: null)).
//PATCH: "parcial": envía só o modificado (se non se inclúen todos os datos, usa os que había antes en vez de "mandalos vacíos coma PUT)). Neste caso PUT xa que modificamos todo na form?
router.put("/categories/:category/:id", isLoggedIn, joiValidationSounds, catchAsync(sounds.editSound));

//DESTROY ROUTE. Elimina un son. Usa post modificado con method-override.
router.delete("/categories/:category/:id", isLoggedIn, isAuthor, catchAsync(sounds.deleteSound));

module.exports = router;