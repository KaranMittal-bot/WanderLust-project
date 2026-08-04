//* This is reviews route file connected to app.js


const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview } = require("../middleware.js");




//! Reviews POST route
router.post("/" , validateReview , wrapAsync(async(req, res) =>{

     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();

    req.flash("success" , "Your Review is added");
     console.log("New review saved");
     res.redirect(`/listings/${req.params.id}`);
}));




//! Reviews DELETE route
router.delete("/:reviewId" , wrapAsync(async(req, res) =>{

    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});

    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review Deleted");
    res.redirect(`/listings/${id}`);
}));



module.exports = router;