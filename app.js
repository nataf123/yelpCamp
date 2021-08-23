const express = require("express");
const app = express();
const path = require("path")
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const Campground = require('./models/compground')

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs')

app.use(express.urlencoded({extended: true}));
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


app.listen(3000, () => {
    console.log("Listening on port 3000")
});

app.get('/', (req, res) => {
    res.render("home.ejs")
});

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find()
    res.render("campgrounds/index.ejs", {camps})
});

app.get('/campgrounds/new', (req, res) => {

    res.render("campgrounds/new.ejs")
});

app.post('/campgrounds', async(req, res) => {
    const camp = new Campground(req.body.campground)
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render("campgrounds/show.ejs", {camp})
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render("campgrounds/edit.ejs", {camp})
});

app.put('/campgrounds/:id', async(req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')

})