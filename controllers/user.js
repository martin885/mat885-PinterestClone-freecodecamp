const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function (req, res) {
    res.redirect('/images');
});




router.get('/signup', function (req, res) {
    res.render('signup', { signupError: req.flash('signupError'),title: 'Login', user: req.user, active: 'login' });
});




router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));


router.get('/login', function (req, res) {
    res.render('login', { loginError: req.flash('loginError'), passwordError: req.flash('passwordError'), title: 'Login', user: req.user, active: 'login' });
});






router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));


router.get('/auth/facebook/callback', passport.authenticate('facebook'
    , {
        failureRedirect: '/login'
    }), function (req, res) {
        res.redirect('/');
    });



module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}