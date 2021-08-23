const express = require("express");
const app = express();
const path = require("path")
const mongoose = require('mongoose');
const Campground = require('./models/compground')

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs')

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

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: "myCamp" })
    await camp.save()
    res.send(camp)
});