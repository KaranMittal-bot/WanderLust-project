const User = require("../models/user");


module.exports.renderSignupForm = (req, res) =>{
    res.render("./users/signup.ejs");
}



module.exports.Signup = async(req, res , next) =>{
   
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

}




module.exports.renderLoginForm = (req, res) =>{
    res.render("./users/login.ejs");
}




module.exports.Login = async(req, res) =>{

    let{username} = req.body;
   req.flash("success" , `Welcome Back! ${username}`); 
   let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}




module.exports.Logout = (req, res , next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }else{
            req.flash("success"  ,"You are logged out");
            return res.redirect("/listings");
        }
    });
}