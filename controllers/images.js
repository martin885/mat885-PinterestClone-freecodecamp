const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Image = require('../models/image');

router.get('/', function (req, res) {
    Image.find({}).populate('owner likes').then(function (images) {
        res.render('images/index', {
            images,
            title: 'Recent Images',
            user: req.user,
            active: 'images',
            messages: req.flash('info')
        })
    });


});

router.post('/add', isLoggedIn, function (req, res) {
    const url = req.body.url;
    const caption = req.body.caption;
    const image = {
        owner: req.user._id,
        url,
        caption
    }
    Image.create(image).then(function (created) {
        User.update({ _id: created.owner }, { $push: { images: created._id } }, function () {
            req.flash('info', { success: 'Image added' });
            return res.redirect(req.get('Referer'));
        });
    });
});

router.get('/:id/like', isLoggedIn, function (req, res) {
    const imageId = req.params.id;
    Image.findByIdAndUpdate(imageId, { $addToSet: { likes: req.user.id } }, function () {
        req.flash('info', { success: 'Image liked' });
        return res.redirect(req.get('Referer'));
    });
});






router.get('/:id/unlike', isLoggedIn, function (req, res) {
    Image.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, function () {
        req.flash('info', { success: 'Image unliked' });
        return res.redirect(req.get('Referer'));
    });
});






router.get('/:id/remove', isLoggedIn, function (req, res) {
    Image.findById(req.params.id, function (err, image) {
        if (err) {
            return console.log(err);
        }
        if (image.owner.toString() !== req.user.id) {
            req.flash('info', { danger: 'You cant delete this image' });
            return console.log('You cant delete this image');
        }
        return image.remove().then(function () {
            User.update({ _id: image.owner }, { $pull: { images: image._id } }, function (err) {
                if (err) {
                    req.flash('info', { danger: 'An error has occurred' });
                    return res.redirect(req.get('Referer'));
                }
                req.flash('info', { success: 'Image removed' });
                return res.redirect(req.get('Referer'));
            });
        });
    });
});

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}