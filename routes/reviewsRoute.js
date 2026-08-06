//* This is reviews route file connected to app.js


const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//! Reviews POST route
router.post("/" ,isLoggedIn, validateReview , wrapAsync(reviewController.createReview));




//! Reviews DELETE route
router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor, wrapAsync( reviewController.deleteReview));



module.exports = router;