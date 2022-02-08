const User = require("../models/user");

//Register
module.exports.registerForm = (req, res) => {
    res.render("users/register");
}

module.exports.newUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;//Destructuramos o que necesitamos do body da form
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Bienvenido a NoNo!");
            res.redirect("/");
        })
    } catch(e) {//facemos un error handler extra para avisar se o nome de usuario ou email xa está en uso
        if(e.message === "A user with the given username is already registered") {
            req.flash("error", "Error: ya existe un usuario con ese nombre.");
            res.redirect("register");
        } else if ((e.message).includes("E11000 duplicate key error collection: nono.users index: email_1 dup key:")) {
            req.flash("error", "Error: ya existe un usuario registrado con ese email.");
            res.redirect("register");
        }else {
            req.flash("error", e.message);
            res.redirect("register");
            console.log(e.message)
        }
    }
}

//Change password
module.exports.modifyForm = (req, res) => {
    const userName = req.user.username;
    res.render("users/modify", { userName });
}

module.exports.modifyPassword = async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    await user.setPassword(req.body.password);
    await user.save();
    req.flash("success","Contraseña modificada correctamente.");
    res.redirect("/")
}

//Login
module.exports.loginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {//Middleware de passport. Xa comproba él a authentication
    req.flash("success", "Bienvenido a NoNo!");
    const redirectUrl = req.session.returnTo || "/";//Usamos o redirectUrl creado no middleware.js para que o devolva a onde estaba ou a /
    delete req.session.returnTo;//Eliminamos despois de usalo para que non de problemas
    res.redirect(redirectUrl);//Rediriximos a url na que estaba despois de login
}

//Logout
module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success","Has cerrado sesión." );
    res.redirect("/");
}