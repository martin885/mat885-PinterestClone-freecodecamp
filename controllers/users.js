const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Image = require('../models/image');

router.get('/', function (req, res) {



    User.find({}, function (err, users) {
        if (err) {
            return console.log(err);
        }
        res.render('users/index', {
            title: 'Users',
            user: req.user,
            users,
            active: 'users',
            messages: req.flash('info')
        })
    });


});

router.get('/:id/pins', function (req, res) {
    User.findById(req.params.id).populate({
        path: 'images',
        populate: {
            path: 'owner',
            ref: 'User'
        }
    }).populate({
        path: 'images',
        populate: {
            path: 'likes',
            ref: 'User'
        }
    }).then(function (user, err) {
        if (err) {
            return console.log(err);
        }
        if (user) {
            return res.render('users/pins', {
                title: `${user.fullname}'s Pins`,
                user: req.user,


                showUser: user,
                messages: req.flash('info'),
                isShowUser: (req.user || {}).id === user.id
            });
        }
        req.flash('info', { warning: 'User not found' });
        return res.redirect('/');
    });
});




router.get('/edit', isLoggedIn, function (req, res) {
    res.render('users/edit', {
        title: 'My Profile',
        user: req.user,
        active: 'editprofile',
        messages: req.flash('info')
    });
});

router.post('/update',isLoggedIn,function(req,res,next){
    User.update({_id:req.user.id},{$set:{fullname:req.body.fullname,city:req.body.city}}).then(function(){
        req.flash('info',{success:'Profile updated'});
        res.redirect(`/users/${req.user.id}`);
    }).catch(next)
});

router.get('/:id', function (req, res, next) {
    User.findById(req.params.id).then(function (user) {
        if (user) {
            return res.render('users/show', {
                title: user.fullname,
                user: req.user,
                showUser: user,
                messages: req.flash('info'),
                active: (req.user || {}).id === user.id ? 'profile' : '',

            });
        }
        req.flash('info', { warning: 'User not found' });
        return res.redirect('/users');
    }).catch(next);
});




module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}