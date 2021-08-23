const path = require("path")
const mongoose = require('mongoose');
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")
const Campground = require('../models/compground')

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 50; i++)
    {
        const rand = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
    
}

seedDB().then( () => {
    mongoose.connection.close()
});