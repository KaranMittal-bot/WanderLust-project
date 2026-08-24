const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Review = require("./review.js")
const Schema = mongoose.Schema;

const listing = new Schema({
    title :{
        type : String,
        required : true
    },

    description : String,

    image: {
        url : String,
        filename: String,
    },

    price : {
        type : Number,
        required : true
    },

    location : {
        type : String,
        required : true
    },
    
    country : {
        type : String,
        required : true
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ], 

    owner : {
        
        type : Schema.Types.ObjectId,
        ref : "User",
        
    },

    category : {
        type : String,
        enum : ["Trending" , "Rooms" , "Iconic Cities" , "Hill Stations" , "Beaches" , "Nature" , "Arctic" , "Swimming" , "Camping" , "Honeymoon" , "Luxury" , "Desert" , "Riverfront" , "Island"],
    },
});



listing.post("findOneAndDelete" ,async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    } 
});



const Listing = mongoose.model("Listing" , listing);
module.exports = Listing;