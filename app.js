const express = require("express");
const app = express();
const path = require("path")
const morgan = require("morgan")
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const Campground = require('./models/compground')
const catchAsync = require("./utils/catchAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {camgroundSchema} = require("./schemas.js")

const ejsMate = require("ejs-mate");
const Joi = require("joi");

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const validateCampground = (req, res, next) => {
    
    const { error } = camgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }

}

app.get('/', (req, res) => {
    res.render("home.ejs")
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find()
    res.render("campgrounds/index.ejs", { camps })
}));

app.get('/campgrounds/new', (req, res) => {

    res.render("campgrounds/new.ejs")
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground)
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render("campgrounds/show.ejs", { camp })
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render("campgrounds/edit.ejs", { camp })
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')

}))

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
