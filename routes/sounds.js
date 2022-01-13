const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();//En caso de ter varias rutas, e que unha requira req.params de outra, hai que especificar express.Router({ mergeParams: true })
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { Sound, Categories } = require("../models/sound");
const joiSoundSchema = require("../validationSchemas");
const  { isLoggedIn, joiValidationSounds, isAuthor } = require("../middleware");//Se non se garda co const =... hay que destructurar
const sounds = require("../controllers/sounds");//reestructuramos as rutas pasándoas ao seu propio archivo en controllers
const multer = require("multer");//Para mandar e subir fotos con forms
const { storage } = require("../cloudinary");//Almacenamento en cloudinary
const upload = multer({ storage });

//ROUTES. Reestructuradas con .route(): une as de cada path. Solo merece a pena as que teñen varias tutas nese path
router.route("/")
    .get(catchAsync(sounds.index))//INDEX ROUTE. Ver todos os sons//reestructuradas en controllers
    .post(isLoggedIn, upload.fields([{ name: 'sound[audio]', maxCount: 1 }, { name: 'sound[image]', maxCount: 1 }]), joiValidationSounds, catchAsync(sounds.newSound));//CREATE ROUTE. Crea un novo son no server

router.get("/categories", catchAsync(sounds.categories));//Ver todas as categorías

router.get("/categories/:category", catchAsync(sounds.category));//Ver sons de cada categoría

router.get("/new", isLoggedIn, sounds.newForm);//NEW ROUTE. Envía a form para crear sons. DEBE ir antes de ("/categories/:category/:id") senón confunde /new con /:id

router.route("/categories/:category/:id")
    .get(catchAsync(sounds.showSound))//SHOW ROUTE. Ver cada son
    .put(isLoggedIn, isAuthor, upload.fields([{ name: 'sound[audio]', maxCount: 1 }, { name: 'sound[image]', maxCount: 1 }]),joiValidationSounds, catchAsync(sounds.editSound))//UPDATE ROUTE. Modifica o son no server.* 
    .delete(isLoggedIn, isAuthor, catchAsync(sounds.deleteSound));//DESTROY ROUTE. Elimina un son. Usa post modificado con method-override.

router.get("/categories/:category/:id/edit", isLoggedIn, isAuthor, catchAsync(sounds.editForm));//EDIT ROUTE. Envía a form para editar sons

module.exports = router;

//*Usa post modificado con method-override. (PUT: "completo": envía un novo obxecto enteiro (se faltan datos quedan vacíos, devolve null (ej se falta name devolve name: null)).
//PATCH: "parcial": envía só o modificado (se non se inclúen todos os datos, usa os que había antes en vez de "mandalos vacíos coma PUT)). Neste caso PUT xa que modificamos todo na form?