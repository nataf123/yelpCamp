const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError.js")
const Campground = require('../models/compground')
const Review = require('../models/review')
const {campgroundSchema, reviewSchema} = require("../schemas.js")

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index.ejs", { campgrounds })
}));

router.get('/new', (req, res) => {

    res.render("campgrounds/new.ejs")
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground)
    await camp.save();
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error', 'cannot find that campground!')
        res.redirect('/campgrounds')
    }
    res.render("campgrounds/show.ejs", { campground })
}));


router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit.ejs", { campground })
}));

router.put('/:id', catchAsync(async (req, res) => {
    const currCamp = await Campground.findById(req.params.id);
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    if(!camp){
        req.flash('error', 'cannot find that campground!')
        res.redirect('/campgrounds')
    }
    req.flash('success', 'Successfully edited the campground')
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted the campground')
    res.redirect('/campgrounds')

}))

module.exports = router;

