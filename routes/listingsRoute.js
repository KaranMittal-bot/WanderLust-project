//* This is listings route file connected to app.js

const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const router = express.Router({ mergeParams: true});
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
//! Listing page call
.get(
    wrapAsync(listingController.index)
)
//! CREATE Route
.post(
    isLoggedIn ,
    upload.single("listing[image][url]"), validateListing, 
    wrapAsync(listingController.createListing)
);




//! NEW route
router.get("/new" , isLoggedIn, listingController.renderNewForm);




//! Search Route
router.get("/search", async (req, res) => {

    const { q } = req.query;

    if (!q || !q.trim()) {
        return res.redirect("/listings");
    }

    const searchTerms = q
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);


    const listings = await Listing.find({
        $and: searchTerms.map(term => ({
            $or: [
                { title: { $regex: term, $options: "i" } },
                { location: { $regex: term, $options: "i" } },
                { country: { $regex: term, $options: "i" } },
                { category: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } }
            ]
        }))
    });


    const scoredListings = listings.map(listing => {

        let score = 0;

        for (const term of searchTerms) {

            if (listing.title.match(new RegExp(term, "i"))) {
                score += 10;
            }

            if (listing.category?.match(new RegExp(term, "i"))) {
                score += 8;
            }

            if (listing.location.match(new RegExp(term, "i"))) {
                score += 6;
            }

            if (listing.country.match(new RegExp(term, "i"))) {
                score += 5;
            }

            if (listing.description?.match(new RegExp(term, "i"))) {
                score += 3;
            }
        }

        return {
            listing,
            score
        };
    });

    scoredListings.sort((a, b) => b.score - a.score);

    console.log(
    scoredListings.map(item => ({
        title: item.listing.title,
        score: item.score
    }))
);

    const rankedListings = scoredListings.map(item => item.listing);

    res.render("listings/index.ejs", {
        allListings: rankedListings
    });
});




//! catergory route
router.get("/category/:category" ,wrapAsync(listingController.categoryListing)
);



router.route("/:id")
//! SHOW ROUTE
.get(
    wrapAsync(listingController.showListing)
)
//! UPDATE Route
.put(
    isLoggedIn ,
    isOwner, 
    upload.single("listing[image][url]"), validateListing , 
    wrapAsync(listingController.updateListing)
)
//! delete route
.delete(
    isLoggedIn ,
    isOwner, 
    wrapAsync(listingController.deleteListing)
);




//! EDIT route
router.get("/:id/edit" , isLoggedIn ,isOwner, wrapAsync(listingController.editListing));



module.exports = router;