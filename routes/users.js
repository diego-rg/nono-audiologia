const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;//Destructuramos o que necesitamos do body da form
    const user = new User({ email, username });
    const registered = await User.register(user, password);
    console.log(registered);
    req.flash("Bienvenido a NoNo!");
    res.redirect("/");
})

module.exports = router;