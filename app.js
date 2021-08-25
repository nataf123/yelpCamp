const express = require("express");
const app = express();
const path = require("path")
const morgan = require("morgan")
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const Campground = require('./models/compground')
const Review = require('./models/review')
const catchAsync = require("./utils/catchAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { campgroundSchema, reviewSchema } = require("./schemas.js")
const campgrounds = require('./routs/campgrounds')
const reviews = require('./routs/reviews')
const session = require("express-session")
const flash = require("connect-flash")
const ejsMate = require("ejs-mate");
const Joi = require("joi");

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


app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


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
