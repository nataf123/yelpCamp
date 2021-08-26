const express = require("express");
const app = express();
const path = require("path")
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const ExpressError = require("./utils/ExpressError.js")
const campgrounds = require('./routs/campgrounds')
const reviews = require('./routs/reviews')
const users = require('./routs/users')
const session = require("express-session")
const flash = require("connect-flash")
const ejsMate = require("ejs-mate");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user")
const mongoSanitize = require("express-mongo-sanitize")


const sessionConfig = {
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}

//uses
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
app.use(mongoSanitize());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash:
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//uses
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/', users)


//mongoose:
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})


//routing:
app.get('/', (req, res) => {
    res.render("home.ejs")
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { code = 500 } = err;
    if (!err.message) {
        err.message = 'Error'
    }
    message = err.message;
    res.status(code).render('error.ejs', { code, message })
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
});
