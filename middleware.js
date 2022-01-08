const { Sound, Categories } = require("./models/sound");
const ExpressError = require("./utilities/ExpressError");
const joiSoundSchema = require("./validationSchemas");

//Comprobar se logeado
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {//usamos un middleware co método is Auth the passporrt para comprobar se está regxistrado
        // req.session.returnTo = req.originalUrl;//para ter acceso a url onde estaba e redirixilo despois do registro//cambiámolo para app.js para melloralo
        req.flash("error", "Debes estar registrado para realizar esta acción.")
        return res.redirect("/login");
    }
    next();
}

//Sacamos a validación Server-Side con Joi para unha función e pasámola nas rutas de post e editar
module.exports.joiValidationSounds = (req, res, next) => {
    const validation = joiSoundSchema.validate(req.body);
    if(validation.error) {
        const errorMsg = validation.error.details.map(msg => msg.message).join(",");//Como Joi mete os detalles do error nun array de objetos, hai q sacalo para enseñalo
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    };
};

//Sacamos a comprobación de estar logeado para middle. Nas tutas, primeiro pasar isLoggedIn para comprobar e ter acceso a user, e logo isAuthor
module.exports.isAuthor = async(req, res, next) => {
    const sound = await Sound.findById(req.params.id);
    if(!sound.author.equals(req.user._id)) {//Evitar que poidan editar sin ser autores
        req.flash("error", "No tienes permiso para realizar esta acción.");
        return res.redirect(`/sounds/categories/:category/${sound._id}`);
    }
    next();
}