const express=require('express');
const router=express.Router();
const passport=require('passport');
const User=require('../models/user');

router.get('/',function(req,res){
res.redirect('/images');
});




router.get('/signup',function(req,res){
    res.render('signup',{signupError:req.flash('signupError')});
});




router.post('/signup',passport.authenticate('local.signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
}));


router.get('/login',function(req,res){
res.render('login',{loginError:req.flash('loginError'),passwordError:req.flash('passwordError')});
});






router.post('/login',passport.authenticate('local.login',{
successRedirect:'/profile',
failureRedirect:'/login',
failureFlash:true
}));

router.get('/profileSearch',isLoggedIn,function(req,res){
    res.render('profile',{user:req.user});
});






router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

module.exports=router;


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}