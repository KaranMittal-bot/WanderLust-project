const User = require("../models/user");

// route to render signup form GET
module.exports.renderSignupForm = (req, res) =>{
    res.render("./users/signup.ejs");
}


// signup route for users POST
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



// route to render login form on GET
module.exports.renderLoginForm = (req, res) =>{
    res.render("./users/login.ejs");
}



// route to LOGIN success POST
module.exports.Login = async(req, res) =>{

    let{username} = req.body;
   req.flash("success" , `Welcome Back! ${username}`); 
   let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}



// route to Logout success POST
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