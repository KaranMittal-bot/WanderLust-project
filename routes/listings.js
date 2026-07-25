const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const router = express.Router({ mergeParams: true});




                    //* ALL METHODS
const validateListing = (req, res, next) =>{
    let {error}= listingSchema.validate(req.body);

    if(error){
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




//! SHOW ROUTE
router.get("/:id" ,wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs" , {listing})
}));




//! NEW/CREATE route
router.get("/new" , (req, res) =>{
    res.render("./listings/newForm.ejs");
});

router.post("/" ,validateListing, wrapAsync(async(req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));




//! EDIT/UPDATE route
router.get("/:id/edit" , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs" , {listing});
}));

router.put("/:id", validateListing , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{... req.body.listing});
    res.redirect("/listings");
}));




//! delete route
router.delete("/:id" , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));




module.exports = router;