module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {//usamos un middleware co método is Auth the passporrt para comprobar se está regxistrado
        req.flash("error", "Debes ser un usuario registrado para añadir sonidos.")
        return res.redirect("/login");
    }
    next();
}