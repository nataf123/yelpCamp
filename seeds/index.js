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
    console.log("Database connected in reset")
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 50; i++)
    {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6127376f8be13d349c5546be',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : 'a very nice place, a very nice place, a very nice place, a very nice place, a very nice place and a very nice place',
            price: price,
        })
        await camp.save();
    }
    
}

seedDB().then( () => {
    mongoose.connection.close()
});