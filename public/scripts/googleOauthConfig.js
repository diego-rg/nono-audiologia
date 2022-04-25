const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../../models/user");

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleOauthConfig = new GoogleStrategy(
  {
    clientID: googleId,
    clientSecret: googleSecret,
    callbackURL: "https://nono-audiologia.herokuapp.com/auth/google/callback",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  },
  function (accessToken, refreshToken, profile, callback) {
    console.log(profile.emails[0].value);
    User.findOne(
      {
        googleId: profile.id,
      },
      function (err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          user = new User({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
          });
          user.save(function (err) {
            if (err) console.log(err);
            return callback(err, user);
          });
        } else {
          return callback(err, user);
        }
      }
    );
  }
);

module.exports = googleOauthConfig;
