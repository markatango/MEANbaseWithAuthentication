var config = require('../config'),
    passport = require('passport'),
    url = require('url'),
    TwitterStrategy = require("passport-twitter").Strategy,
    
    users = require('../../app/controllers/users.server.controller');

module.exports = function() {
    passport.use(new TwitterStrategy({
        consumerKey : config.twitter.consumer_key,
        consumerSecret : config.twitter.consumer_secret,
        callbackURL : config.twitter.callbackURL,
        passReqToCallback : true
        },
        function(req, accessToken, refreshToken, profile, done){
        console.log("profile returned from Twitter: " + JSON.stringify(profile));
        console.log("accessToken: " + accessToken);
        console.log("refreshToken: " + refreshToken);
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        
        var providerUserProfile = {
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
