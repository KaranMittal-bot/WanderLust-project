const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js")
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

//! creating useful shi





//! listening port
app.listen(port , () =>{
    console.log("app listening on port : ",port);
});




//! Listing page call

app.get("/listings" , async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
});





//! NEW & CREATE route

app.get("/listings/new" , (req, res) =>{
    res.render("./listings/newForm.ejs");
});

app.post("/listings" , async(req, res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});






//! EDIT route

app.get("/listings/:id/edit" , async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs" , {listing});
});


app.put("/listings/:id", async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{... req.body.listing});
    console.log("updated!");
    res.redirect("/listings");
});






//! delete route
app.delete("/listings/:id" , async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});




//! SHOW ROUTE

app.get("/listings/:id" ,async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs" , {listing})
});