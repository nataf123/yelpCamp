const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError.js")
const Campground = require('../models/compground')
const Review = require('../models/review')
const { campgroundSchema, reviewSchema } = require("../schemas.js")
const User = require("../models/user")
const passport = require("passport")


router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser)
        req.flash('success', 'Welcome to yelp camp!');
        res.redirect('/campgrounds')
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))


router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res) => {
    req.flash('success', 'Welcome Back!')
    res.redirect('/campgrounds')
})


module.exports = router;