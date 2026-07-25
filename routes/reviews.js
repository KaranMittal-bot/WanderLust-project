const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");



//* ALL METHODS
const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errorMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errorMsg);
    } 

    next();
};




//! Reviews POST route
router.post("/" , validateReview , wrapAsync(async(req, res) =>{

     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();


     console.log("New review saved");
     res.redirect(`/listings/${req.params.id}`);
}));




//! Reviews DELETE route
router.delete("/:reviewId" , wrapAsync(async(req, res) =>{

    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});

    await Review.findByIdAndDelete(reviewId);

    console.log("Review deleted!");
    console.log("review id:", reviewId);
    console.log("Listing Id : " ,id);

    res.redirect(`/listings/${id}`);
}));



module.exports = router;