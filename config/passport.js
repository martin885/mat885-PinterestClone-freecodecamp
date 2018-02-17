const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;









const User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'fullname',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, fullname, password, done) {
    User.findOne({ 'fullname': fullname }, function (err, user) {



        if (err) {
            return done(err);
        }
        if (user) {
            req.flash('signupError','User Already Exist');
            return done(null, false);
        }
        var newUser = new User();
        newUser.fullname = req.body.fullname;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save(function (err) {
            if (err) {


                return done(err);
            }
            return done(null, newUser);
        });
    })
}));








passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {



        if (err) {
            return done(err);
        }
        if (!user) {
            req.flash('loginError','User Data Not Found');
            return done(null, false);
        }

        if (!user.validPassword(req.body.password)) {
            req.flash('passwordError','User Password Is Incorrect');
            return done(null, false);
        }
        return done(null, user);
    })
}));

passport.use(new FacebookStrategy({

    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CLIENTURL,
    profileFields: ['id', 'displayName', 'email']

}, function (accessToken, refreshToken, profile, done) {

    User.findOne({ idFacebook: profile.id }, function (err, user) {
        if (err) {
            done(err);
        }
        if (user && user !== null) {
            return done(null, user);
        }
        else {
            var newUser = new User()

            newUser.idFacebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.save(function (err) {

                if (err) {

                    return console.log(err);
                }

                return done(null, newUser);
            });
        }
    });
}));