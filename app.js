if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const soundsRoutes = require("./routes/sounds"); //Importamos as rutas
const usersRoutes = require("./routes/users");
const passport = require("passport"); //Authentication
const passportLocal = require("passport-local"); //Authentication
const User = require("./models/user"); //Requerir o schema de user
const mongoSanitize = require("express-mongo-sanitize"); //Evita que se poidar usan símbolos (operators) como $ nas queries para atacar/modifica/sacar datos da nosa db dende a app
const helmet = require("helmet"); //Máis funcións de seguridad basadas en HTTP headers
const MongoStore = require("connect-mongo"); //Para gardar a sesión en mongo e non na memoria
const helmetDirectives = require("./utilities/helmetDirectives");
const googleOauthConfig = require("./public/scripts/googleOauthConfig");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/nono"; //Para acceder aos datos da dirección de mongoAtlas de env

//'mongodb://localhost:27017/nono' db local
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!");
    console.log(err);
  });

const app = express();

app.engine("ejs", ejsMate); //Para usar o egine de ejs e non o default
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //Para req.body en CREATE
app.use(methodOverride("_method")); //Para poder crear DELETE e UPDATE/EDIT

app.use(express.static(path.join(__dirname, "public"))); //Fai que a carpeta para servir imágenes, scripts, audio etc sea public por defecto

app.use(mongoSanitize()); //"Bloqueará" as queries que usen $ e outros símbolos que son operadores

//Sesion
const secret = process.env.SECRET || "secretBigSecret";
const sessionConfig = {
  store: MongoStore.create({ mongoUrl: dbUrl, touchAfter: 24 * 3600 }), //A sesión só se modificará unha vez cada 24 horas se non hai cambios
  name: "session", //por defecto chámase connect.sid, cambiamos nome
  secret, //Clave que debe estar nunha variable de entorno por seguridad
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //Seguridad. Evitar que os scripts do client-side poidan acceder ás cookies protegidas (como ataques XSS)
    // secure: true,                        //para https, solo despois do deploy
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //configura cando expira en milisegundos: 1000= 1seg, *60= 1 min etc
    maxAge: 1000 * 60 * 60 * 24 * 7, //antigüedad máxima
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet()); //Máis funcións de seguridad basadas en HTTP headers

//Configuración de helmet: movida a utilitiespassport-google-oauth2
app.use(helmet.contentSecurityPolicy(helmetDirectives.nonoDirectives));

//Configuración de passport
app.use(passport.initialize()); //Authentication. Despois de session
app.use(passport.session()); //Authentication. Despois de session
passport.use(googleOauthConfig); //Authentication con GoogleOauth. Configuración en scripts
passport.use(new passportLocal(User.authenticate())); //Authentication. Despois de session
passport.serializeUser(User.serializeUser()); //métodos de passport
passport.deserializeUser(User.deserializeUser()); //métodos de passport

//Middleware para mensaxes flash nas rutas. Debe ir antes delas
app.use((req, res, next) => {
  if (!["/login", "/", "/logout"].includes(req.originalUrl)) {
    //Pasamos parte de middleware.js: Ahora sempre te redirixe a última páxina visitada despois de rexistrarte.
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user; //Añadimos ao middle datos sobre o usuario logeado para acceder a eles para o front
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/sounds", soundsRoutes); //Activamos as rutas
app.use("/", usersRoutes); //Deixamos a ruta con / para que sea nono/register solo

//Google OAuth 2.0
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

//Show homepage
app.get("/", (req, res) => {
  res.render("sounds/home");
});

//Show sección sobre o proxecto
app.get("/about", (req, res) => {
  res.render("sounds/about");
});

//Error 404 para TODOS os path que non existen (NON conta as ids, solo path base). Debe ir ao final. COn next pasa ao siguiente
app.all("*", (req, res, next) => {
  next(new ExpressError("La página que buscas no existe.", 404));
});

//Base error handler. Encadena desde o anterior app.all. Levan valores por defecto por si acaso, no caso de message é condicional
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Ha habido un problema al cargar la página.";
  res.status(status).render("errorTemplate", { err });
});

//3000 para local, datos don porto en env en deploy. Debe ir en maiúsculas xa que é o q usa heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
