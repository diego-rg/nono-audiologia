const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../../models/user");

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleOauthConfig = new GoogleStrategy(
  {
    clientID: googleId,
    clientSecret: googleSecret,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ["profile"],
  },
  function (accessToken, refreshToken, profile, cb) {
    new User({
      username: profile.displayName,
      googleID: profile.id,
    })
      .save()
      .then((newUser) => {
        console.log("Nuevo usuario: " + newUser);
        cb(null, newUser);
      });
  }
);

module.exports = googleOauthConfig;
