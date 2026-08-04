const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = (req, res, next) =>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Please Login first");
        return res.redirect("/login");  
    }
    next();
};



module.exports.saveRedirectUrl = (req, res, next) =>{
        if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
};




module.exports.isOwner = async(req, res , next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You don't have permission to update this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};





module.exports.validateListing = (req, res, next) =>{
    console.log(req.body);
    console.log(JSON.stringify(req.body, null, 2));
    let {error}= listingSchema.validate(req.body);

    if(error){
        console.log("Error cuaght in validateListing middleware : " , error.details);
        let errorMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errorMsg);
    } 

    next();
};




module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errorMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errorMsg);
    } 

    next();
};