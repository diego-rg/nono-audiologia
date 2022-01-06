const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");//Authentication

//Register
router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res) => {
    try{
        const { username, email, password } = req.body;//Destructuramos o que necesitamos do body da form
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Bienvenido a NoNo!");
            res.redirect("/");
        })
    } catch(e) {//facemos un error handler extra para avisar se o nome de usuario xa está en uso e traducímolo
        let translatedError;
        if( e.message === "A user with the given username is already registered") {
            translatedError = "Error: ya existe un usuario con ese nombre."
            req.flash("error", translatedError);
            res.redirect("register");
        } else {
           req.flash("error", e.message);
            res.redirect("register"); 
        }
    }
}))

//Login
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {//Middleware de passport. Xa comproba él a authentication
    req.flash("success", "Bienvenido a NoNo!");
    const redirectUrl = req.session.returnTo || "/";//Usamos o redirectUrl creado no middleware.js para que o devolva a onde estaba ou a /
    delete req.session.returnTo;//Eliminamos despois de usalo para que non de problemas
    res.redirect(redirectUrl);//Rediriximos a url na que estaba despois de login
})

//Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success","Has cerrado sesión." );
    res.redirect("/");
})

module.exports = router;