const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");




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


const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => (
        {...obj , owner: "6a6e8e547b3ef2e9729500ba"}
    ));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDb();