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
const { listingSchema } = require("./schema.js");
const port = 2009;


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

//! creating useful shi






app.get("/" , (req,res) =>{
    res.send("Hi! , I am root");
});



const validateListing = (req, res, next) =>{
    let (error) = listingSchema.validate(req.body);
    console.log(result);

    if(error){
        let errorMsg = err.detail.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errorMsg);
    } 
}



//! Listing page call

app.get("/listings" , wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
}));





//! NEW & CREATE route

app.get("/listings/new" , (req, res) =>{
    res.render("./listings/newForm.ejs");
});

app.post("/listings" ,validateListing, wrapAsync(async(req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));






//! EDIT route

app.get("/listings/:id/edit" , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs" , {listing});
}));


app.put("/listings/:id", validateListing , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{... req.body.listing});
    res.redirect("/listings");
}));





//! SHOW ROUTE

app.get("/listings/:id" ,wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs" , {listing})
}));





//! delete route
app.delete("/listings/:id" , wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));






//! Reviews POST route
app.post("/listings/:id/reviews" , async(req, res) =>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();


     console.log("New review saved");
     res.send("New review saved!");
});








//! listening port
app.listen(port , () =>{
    console.log("app listening on port : ",port);
});


app.use((req, res, next) =>{
    next(new ExpressError(404 , "Page Not found!"));
});


app.use((err,req, res, next) =>{
    let {statusCode=500 , message="Something went wrong!"} = err;
    res.status(statusCode).render("Error.ejs" , { message });
    // res.status(statusCode).send(message);
});