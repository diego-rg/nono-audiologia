const { Sound, Categories } = require("../models/sound");
const cloudinary = require('cloudinary').v2;

//INDEX ROUTE. Ver todos os sons
module.exports.index = async (req, res, next) => {
    const sounds = await Sound.find({}).collation({ locale: "es" }).sort({ name: "asc"});//Añadimos sort para orden alfabético e collation para que non distinga minúsculas de maiúsculas
    res.render("sounds/sounds", { sounds });
}

//Ver todas as categorías
module.exports.categories = async (req, res) => {
    const categs = await Categories;
    res.render("sounds/categories", { categs });
}

//Ver cada categoria
module.exports.category = async (req, res) => {
    const sounds = await Sound.find({ category: req.params.category }).sort({ name: "asc"});//Añadimos sort para orden alfabético
    const soundCategory = req.params.category;//Pasamos como variable a categoría que corresponde para eseñala no correspondente ejs
    res.render("sounds/category", { sounds, soundCategory });
}

//NEW ROUTE. Envía a form para crear sons
module.exports.newForm = (req, res) => {
    res.render("sounds/new", { Categories });
}

//CREATE ROUTE. Crea un novo son no server
module.exports.newSound = async (req, res) => {
    // if(!req.body.sound) throw new ExpressError("Los datos introducidos no son válidos", 400);//Por si salta a validación da form (ej: usando postman)
    const sound = new Sound(req.body.sound);//requiere extended: true
    sound.audio.url = req.files["sound[audio]"][0].path;//Gardar na db as urls e nomes en cloudinary
    sound.audio.filename = req.files["sound[audio]"][0].filename;
    sound.image.url = req.files["sound[image]"][0].path;
    sound.image.filename = req.files["sound[image]"][0].filename;
    sound.author = req.user._id;
    await sound.save();
    req.flash("success", "Se ha añadido un nuevo sonido.");//Mensaxe flash ao crear son correctamente. Hai que pasala pola páxina a onde redirixe a ruta para vela (...:id)
    res.redirect(`/sounds/categories/:category/${sound._id}`);
}

//SHOW ROUTE. Ver cada son
module.exports.showSound = async (req, res, next) => {
    const sound = await Sound.findById(req.params.id).populate("author");//Asociar co author como está no model
    const soundCategory = req.params.category;
    if(!sound) {//Solo funciona cando a id foi eliminada ou cando  podería ser válida?
        req.flash("error", "El sonido que indica no existe.")
        return res.redirect("/sounds");
    };
    res.render("sounds/show", { sound, soundCategory }); //Habería que pasar o flasha aquí con , msg: req.flash("success") , pero mellor usar middle
}

//EDIT ROUTE. Envía a form para editar sons
module.exports.editForm = async (req, res) => {//Primeiro pasar isLoggedIn para comprobar e ter acceso a user
    const sound = await Sound.findById(req.params.id);
    const soundCategory = req.params.category;
    if(!sound) {
        req.flash("error", "El sonido que indica no existe.")
        return res.redirect("/sounds");
    }
    res.render("sounds/edit", { sound, Categories, soundCategory });
}

//UPDATE ROUTE.
module.exports.editSound = async (req, res) => {
    const { id } = req.params;
    const sound = await Sound.findByIdAndUpdate(id, { ...req.body.sound });
    await cloudinary.uploader.destroy(sound.audio.filename, {//Eliminar mp3 de cloudinary
        resource_type:'video', invalidate: true,
    }, (err, result) => {
        console.log(err, result);
    });
    await cloudinary.uploader.destroy(sound.image.filename, {//Eliminar imagen de cloudinary
        resource_type:'image', invalidate: true,
    }, (err, result) => {
        console.log(err, result);
    });
    sound.audio.url = req.files["sound[audio]"][0].path;//Gardar na db as urls e nomes en cloudinary
    sound.audio.filename = req.files["sound[audio]"][0].filename;
    sound.image.url = req.files["sound[image]"][0].path;
    sound.image.filename = req.files["sound[image]"][0].filename;
    sound.author = req.user._id;
    await sound.save();//Como tamén modificamos imaxes e audio, ahora hai que engadir save, antes chegaba con findByIdAndUpdate
    req.flash("success", "Datos del sonido modificados.");
    res.redirect(`/sounds/categories/:category/${sound._id}`);
}

//DESTROY ROUTE.
module.exports.deleteSound = async (req, res) => {
    const { id } = req.params;
    const sound = await Sound.findById(id);
    await cloudinary.uploader.destroy(sound.audio.filename, {//Eliminar mp3 de cloudinary. Debe eliminarse primeiro en cloud e logo o propio son da db
        resource_type:'video', invalidate: true,
    }, (err, result) => {
        console.log(err, result);
    });
    await cloudinary.uploader.destroy(sound.image.filename, {//Eliminar imagen de cloudinary
        resource_type:'image', invalidate: true,
    }, (err, result) => {
        console.log(err, result);
    });
    await Sound.findByIdAndDelete(id);
    req.flash("success", "Sonido eliminado.");
    res.redirect("/sounds");
}