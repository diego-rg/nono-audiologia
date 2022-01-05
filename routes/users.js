const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res) => {
    try{
        const { username, email, password } = req.body;//Destructuramos o que necesitamos do body da form
        const user = new User({ email, username });
        const registered = await User.register(user, password);
        req.flash("success", "Bienvenido a NoNo!");
        res.redirect("/");
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

module.exports = router;