const Listing= require("../models/listing");



//* route to index main page [GET]
module.exports.index =async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
}



//* route to renderNewForm for Listing creation [GET]
module.exports.renderNewForm = (req, res) =>{
    res.render("./listings/newForm.ejs");
}



//* route to show selected Listing details [POST]
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




//* route to create New Listing [POST]
module.exports.createListing = async(req, res, next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success" , "Your Listing was Added");
    res.redirect("/listings");
}




//* route to render edit Form of existing Listing [GET]
module.exports.editListing = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing){
        req.flash("error" , "Listing do no exist");
        return res.redirect("/listings");
    }
    
    let orgImageUrl = listing.image.url;
    let OrgImageUrl = orgImageUrl.replace("/upload", "/upload/w_250")
    res.render("./listings/edit.ejs" , {listing , OrgImageUrl});
}




//* route to update edited Listing [POST] 
module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});

    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success" , "Your Listing is Updated");
    res.redirect("/listings");
}




//* route to destroy existing listing [POST]
module.exports.deleteListing = async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted");
    res.redirect("/listings");
}