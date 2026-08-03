//* This is listings route file connected to app.js

const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const router = express.Router({ mergeParams: true});
const {isLoggedIn} = require("../middleware.js");



                    //* ALL METHODS
const validateListing = (req, res, next) =>{
    console.log(req.body);
    console.log(JSON.stringify(req.body, null, 2));
    let {error}= listingSchema.validate(req.body);

    if(error){
        console.log(error.details);
        let errorMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errorMsg);
    } 

    next();
};




//! Listing page call
router.get("/" , wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
}));




//! NEW/CREATE route
router.get("/new" , isLoggedIn,  (req, res) =>{
    res.render("./listings/newForm.ejs");
});

router.post("/" ,isLoggedIn , validateListing, wrapAsync(async(req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "Your Listing was Added");
    res.redirect("/listings");
}));




//! SHOW ROUTE
router.get("/:id" ,wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error" , "Listing do no exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs" , {listing})
}));




//! EDIT route
router.get("/:id/edit" , isLoggedIn , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing){
        req.flash("error" , "Listing do no exist");
        return res.redirect("/listings");
    }
    
    res.render("./listings/edit.ejs" , {listing});
}));




//! UPDATE Route
router.put("/:id", validateListing , isLoggedIn , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{... req.body.listing});
    req.flash("success" , "Your Listing is Updated");
    res.redirect("/listings");
}));




//! delete route
router.delete("/:id" , isLoggedIn , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted");
    res.redirect("/listings");
}));




module.exports = router;