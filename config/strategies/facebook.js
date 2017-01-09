var config = require('../config'),
    passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require("passport-facebook").Strategy,
    
    users = require('../../app/controllers/users.server.controller');

module.exports = function() {
    passport.use(new FacebookStrategy({
        clientID : config.facebook.client_ID,
        clientSecret : config.facebook.client_secret,
        callbackURL : config.facebook.callbackURL,
        passReqToCallback : true
        },
        function(req, accessToken, refreshToken, profile, done){
         console.log("profile returned from Facebook: " + JSON.stringify(profile));
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        
        var providerUserProfile = {
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            fullName : profile.displayName,
            username : profile.username,
            provider : 'facebook',
            providerId : profile.id,
            providerData : providerData
        };
        
        profile.email = profile.emails ? profile.emails[0].value : "example@localhost.com";
        
        console.log("in passport.use: providerUserProfile" + JSON.stringify(providerUserProfile))
        
        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};

//logic truth table
/*
err:true => user:dc user.authenticate:dc 
err:false & user:false => user.authenticate:dc 
err:false & user:true & user.authenticate:false => Error
err:false & user:true & user.authenticate:true => success
*/

/*
clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
    */