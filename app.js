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
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const port = 2009;




//* Routers
const listings = require("./routes/listings.js")
const reviews = require("./routes/reviews.js");




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




const sessionOptions = {
    secret : "mySuerSecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};




//! ROOT
app.get("/" , (req,res) =>{
    res.send("Hi! , I am root");
});




app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    next();
});




//* ROUTERS
app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);




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