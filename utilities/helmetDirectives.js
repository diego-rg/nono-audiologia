//Config de helmet.  Hai que engadir crossorigin="anonymous" en todos os archivos de audio/video...e o Src na app.use de scripts, audio, img, fonts etc
module.exports.nonoDirectives = {
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'"],
        scriptSrc: ["'unsafe-inline'", "'self'", "https://cdn.jsdelivr.net/", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        mediaSrc: [ "'self'", "blob:", "data:", "https://res.cloudinary.com/dtevt8s36/", ],
        imgSrc: [ "'self'", "blob:", "data:", "https://res.cloudinary.com/dtevt8s36/", ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net/"],
    },
}