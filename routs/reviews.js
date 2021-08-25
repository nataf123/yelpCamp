const express = require("express")
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError.js")
const Campground = require('../models/compground')
const Review = require('../models/review')
const {campgroundSchema, reviewSchema} = require("../schemas.js")

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    console.log(req.params)
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    camp.reviews.push(review)
    await camp.save()
    await review.save()
    req.flash('success', 'Successfully created new review')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:revId', catchAsync(async (req, res) => {
    const { revId } = req.params;
    await Campground.findOneAndUpdate(req.params.id, { $pull: {reviews : revId}});
    await Review.findByIdAndDelete(revId)
    req.flash('success', 'Successfully deleted the review')
    res.redirect(`/campgrounds/${req.params.id}`)

}))

module.exports = router;