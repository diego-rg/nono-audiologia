const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");//Authentication
const users = require("../controllers/users")

router.route("/register")
    .get(users.registerForm)//Register form
    .post(catchAsync(users.newUser));//New user

router.route("/login")
    .get(users.loginForm)//Login form
    .post(passport.authenticate("local", { failureFlash: "Los datos introducidos no son válidos.", failureRedirect: "/login" }), users.loginUser);//Log in user

router.get("/logout", users.logoutUser);//Log out user

router.route("/modify")
    .get(users.modifyForm)//Modificar form
    .post(catchAsync(users.modifyPassword));//Modificar password

module.exports = router;