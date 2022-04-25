const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../../models/user");

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleOauthConfig = new GoogleStrategy(
  {
    clientID: googleId,
    clientSecret: googleSecret,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ["profile", "https://www.googleapis.com/auth/userinfo.email"],
  },
  async function (accessToken, refreshToken, profile, cb) {
    const userExists = await User.findOne({ googleid: profile.id });
    if (userExists) {
      cb(null, userExists);
    } else {
      const user = new User({
        name: profile.displayName,
        googleid: profile.id,
      })
      const registeredUser = await User.register(user);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Bienvenido a NoNo!");
      res.redirect("/");
    });
    }
  }
);

module.exports = googleOauthConfig;
