var passport = require('passport'),
    LocalStategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');


module.exports = function() {
    passport.use(new LocalStategy(function(username, password, done){
        User.findOne({username : username}, function(err, user){
            if (err) {
                return done(err);
            }
            
            if(!user) {
                return done(null, false, {message : 'Unknown user'});
            }
            
            if(!user.authenticate(password)) {
                return done(null, false, {message : 'Invalid password'});
            }
            
            return done( null, user);
        });
    }));
};

//logic truth table
/*
err:true => user:dc user.authenticate:dc 
err:false & user:false => user.authenticate:dc 
err:false & user:true & user.authenticate:false => Error
err:false & user:true & user.authenticate:true => success
*/



