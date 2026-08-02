const express = require("express");
const router = express.Router({ mergeParams: true});
const User = require ("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");



//! SIGNUP 
router.get("/signup" , (req, res) =>{
    res.render("./users/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req, res , next) =>{
   
    try{
        let {username , email, password} = req.body;
        const newUser = new User({email , username});
        const regUser = await User.register(newUser, password);
        req.login(regUser , (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success" , `Welcome ${username} !`);
            res.redirect("/listings");
        });

    } catch(err){
        req.flash("error" , "Username already registered");
        res.redirect("/signup");
    }

}));





//!LOGIN

router.get("/login" , (req, res) =>{
    res.render("./users/login.ejs");
});

router.post("/login" , 
    saveRedirectUrl , 
    passport.authenticate("local" , { failureRedirect: '/login' , failureFlash : true}) , async(req, res) =>{

    let{username} = req.body;
   req.flash("success" , `Welcome Back! ${username}`); 
   let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});
 



//! LOGOUT

router.get("/logout" , (req, res , next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }else{
            req.flash("success"  ,"You are logged out");
            return res.redirect("/listings");
        }
    });
});





module.exports = router;