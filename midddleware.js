const ExpressError = require('./utils/ExpressError') // adding the express error handler
const { campgroundSchema, reviewSchema } = require('./schemas') //for the joi - checing for a hacking requests by postman 
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you need to log in first');
        return res.redirect('/login')
    }
     next()
}

module.exports.validateCampground = (req, res, next) => { //jumping to the problem pages if there is ann error
    const { error } = campgroundSchema.validate(req.body) // validate the req.body
    if (error) { //if there is an error
        const msg = error.details.map(el => el.message).join(',') //were going to map it all and to make all parts of the array
        throw new ExpressError(msg, 400) // jump to the error
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => { //function to check if the logged in user is the author of the camp
    const { id } = req.params; // get the id of the camp
    const camp = await Campground.findById(id); // find in wich camp you are in by finding its id
    if (!camp.author.equals(req.user._id)) { //if the camp.author is not the user that singed in
        req.flash('error', 'you do not have  the premission to do that!'); // flash massage
        return res.redirect(`/campgrounds/${id}`) // redirect 
    }
    next();
}

module.exports.validateReview = (req, res, next) => { // finding if there is  a problem with the reviews data
    const { error } = reviewSchema.validate(req.body)
    if (error) { //if there is an error
        const msg = error.details.map(el => el.message).join(',') //were going to map it all and to make all parts of the array
        throw new ExpressError(msg, 400) // jump to the error
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => { //function to check if the logged in user is the author of the review
    const { id , reviewId } = req.params; // get the id of the camp and the revire
    const review = await Review.findById(reviewId); // find in wich review you are in by finding its id
    if (!review.author.equals(req.user._id)) { //if the review.author is not the user that singed in
        req.flash('error', 'you do not have  the premission to do that!'); // flash massage
        return res.redirect(`/campgrounds/${id}`) // redirect 
    }
    next();
}
