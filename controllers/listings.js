const Listing= require("../models/listing");



// route to index main page [GET]
module.exports.index =async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
}



// route to renderNewForm for Listing creation [GET]
module.exports.renderNewForm = (req, res) =>{
    res.render("./listings/newForm.ejs");
}



// route to show selected Listing details [POST]
module.exports.showListing = async (req, res) =>{
    let {id} = req.params;

    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {
        path : "author",
    },
}).populate("owner");

    if(!listing){
        req.flash("error" , "Listing do no exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs" , {listing})
}




// route to create New Listing [POST]
module.exports.createListing = async(req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "Your Listing was Added");
    res.redirect("/listings");
}




// route to render edit Form existing Listing [GET]
module.exports.editListing = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing){
        req.flash("error" , "Listing do no exist");
        return res.redirect("/listings");
    }
    
    res.render("./listings/edit.ejs" , {listing});
}




// route to update edited Listing [POST]
module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{... req.body.listing});
    req.flash("success" , "Your Listing is Updated");
    res.redirect("/listings");
}




// route to destroy existing listing [POST]
module.exports.deleteListing = async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted");
    res.redirect("/listings");
}