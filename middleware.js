module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {//usamos un middleware co método is Auth the passporrt para comprobar se está regxistrado
        // req.session.returnTo = req.originalUrl;//para ter acceso a url onde estaba e redirixilo despois do registro//cambiámolo para app.js para melloralo
        req.flash("error", "Debes estar registrado para realizar esta acción.")
        return res.redirect("/login");
    }
    next();
}