var config = require('../config'),
    passport = require('passport'),
    url = require('url'),
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    
    users = require('../../app/controllers/users.server.controller');

module.exports = function() {
    passport.use(new GoogleStrategy({
        clientID : config.google.client_ID,
        clientSecret : config.google.client_secret,
        callbackURL : config.google.callbackURL,
        passReqToCallback : true
        },
        function(req, accessToken, refreshToken, profile, done){
        //console.log("profile returned from Google: " + JSON.stringify(profile));
        //console.log("accessToken: " + accessToken);
        //console.log("refreshToken: " + refreshToken);
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        
        var providerUserProfile = {
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            fullName : profile.displayName,
            username : profile.username,
            provider : 'google',
            providerId : profile.id,
            providerData : providerData
        };
        profile.email = profile.emails ? profile.emails[0].value : "example@localhost.com";
        
        //console.log("in passport.use: providerUserProfile" + JSON.stringify(providerUserProfile))
        
        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
