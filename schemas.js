const Joi = require("Joi")


module.exports.camgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
    }).required()
})