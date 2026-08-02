const express = require("express");
const router = express.Router();
const User = require ("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");



//! SIGNUP 
router.get("/signup" , (req, res) =>{
    res.render("./users/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req, res , next) =>{
   
    try{
        let {username , email, password} = req.body;
        const newUser = new User({email , username});
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.flash("success" , `Welcome ${username} !`);
        res.redirect("/listings");
    } catch(err){
        req.flash("error" , "Username already registered");
        res.redirect("/signup");
    }

}));





//!LOGIN

router.get("/login" , (req, res) =>{
    res.render("./users/login.ejs");
});

router.post("/login" , passport.authenticate("local" , { failureRedirect: '/login' , failureFlash : true}) , async(req, res) =>{

    let{username} = req.body;
   req.flash("success" , `Welcome Back! ${username}`); 
    res.redirect("/listings");

});
 

module.exports = router;