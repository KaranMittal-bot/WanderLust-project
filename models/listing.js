const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Review = require("./review.js")
const Schema = mongoose.Schema;

const listing = new Schema({
    title :{
        type : String,
        required : true
    },

    description :{
        type : String
    },

    image: {
        filename: {
            type: String,
            default: "listingimage"
        },

        url: {
            type: String,
            default:
            "https://media.istockphoto.com/id/2223376026/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=KmXb1-GWZvz-Fa6TvMKIbNsxfEs09t6Nm5NEzrMBy3E="
        }
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
    ]
});



listing.post("findOneAndDelete" ,async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});



const Listing = mongoose.model("Listing" , listing);
module.exports = Listing;