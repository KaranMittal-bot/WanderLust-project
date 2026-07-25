const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const port = 2009;

const listings = require("./routes/listing.js")



//! connection with mongoDb
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main()
.then((res) =>{
    console.log("Connected Succesffuly to MongoDb");
})
.catch((err) =>{
    console.log("error in db connection : ",err);
})



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "/public")));




//* ALL METHODS
const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errorMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errorMsg);
    } 

    next();
};




//! ROOT
app.get("/" , (req,res) =>{
    res.send("Hi! , I am root");
});



//* ROUTERS
app.use("/listings" , listings);




//! Reviews POST route
app.post("/listings/:id/reviews" , validateReview , wrapAsync(async(req, res) =>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();


     console.log("New review saved");
     res.redirect(`/listings/${req.params.id}`);
}));




//! Reviews DELETE route
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req, res) =>{

    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});

    await Review.findByIdAndDelete(reviewId);

    console.log("Review deleted!");
    console.log("review id:", reviewId);
    console.log("Listing Id : " ,id);

    res.redirect(`/listings/${id}`);
}));




//! listening port
app.listen(port , () =>{
    console.log("app listening on port : ",port);
});




//* ERROR HANDLERS
app.use((req, res, next) =>{
    next(new ExpressError(404 , "Page Not found!"));
});


app.use((err,req, res, next) =>{
    let {statusCode=500 , message="Something went wrong!"} = err;
    res.status(statusCode).render("Error.ejs" , { message });
    // res.status(statusCode).send(message);
});