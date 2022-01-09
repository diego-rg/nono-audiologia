const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");//Authentication
const users = require("../controllers/users")

//Register
router.get("/register", users.registerForm);

router.post("/register", catchAsync(users.newUser));

//Login
router.get("/login", users.loginForm);

router.post("/login", passport.authenticate("local", { failureFlash: "Los datos introducidos no son válidos.", failureRedirect: "/login" }), users.loginUser);

//Logout
router.get("/logout", users.logoutUser);

module.exports = router;