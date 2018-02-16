const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Image = require('../models/images');

router.get('/', function (req, res) {
    Image.find({}).populate('owner likes').then(function (images) {
        res.render('images/index',{
            images,
            title:'Recent Images',
            user:req.user,
            active:'images',
            messages:req.flash('info')
        })
    });
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}