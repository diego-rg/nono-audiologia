const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../../models/user");

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleOauthConfig = new GoogleStrategy(
  {
    clientID: googleId,
    clientSecret: googleSecret,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  },
  function (accessToken, refreshToken, profile, callback) {
    console.log(profile.emails[0].value);
  }
);

module.exports = googleOauthConfig;
