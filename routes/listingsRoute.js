//* This is listings route file connected to app.js

const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const router = express.Router({ mergeParams: true});
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")


//! Listing page call
router.get("/" , wrapAsync(listingController.index));




//! NEW/CREATE route
router.get("/new" , isLoggedIn, listingController.renderNewForm);

router.post("/" ,isLoggedIn , validateListing, wrapAsync(listingController.createListing));




//! SHOW ROUTE
router.get("/:id" ,wrapAsync(listingController.showListing));




//! EDIT route
router.get("/:id/edit" , isLoggedIn ,isOwner, wrapAsync(listingController.editListing));




//! UPDATE Route 
router.put("/:id", isLoggedIn , isOwner, validateListing , wrapAsync(listingController.updateListing));




//! delete route
router.delete("/:id" , isLoggedIn ,isOwner, wrapAsync(listingController.deleteListing));




module.exports = router;