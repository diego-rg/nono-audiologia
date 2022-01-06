module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {//usamos un middleware co método is Auth the passporrt para comprobar se está regxistrado
        req.session.returnTo = req.originalUrl;//para ter acceso a url onde estaba e rediriilo despois do registro
        req.flash("error", "Debes estar registrado para añadir sonidos.")
        return res.redirect("/login");
    }
    next();
}