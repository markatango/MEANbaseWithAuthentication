// Load the module dependencies
const User = require('mongoose').model('User');
const passport = require('passport');



// Create a new error handling controller method
const getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (const errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

//CRUD
//==========================
exports.create = function(req, res, next){
    var user = new User(req.body);
    user.save(function(err){
        if(err){
            return next(err);
        } else {
            res.json(user);
        }
    });    
};
              
exports.list = function(req, res, next){
    User.find({}, function(err, users){
        if(err){
            return next(err);
        } else {
            res.json(users);
        }
    });
};

exports.read = function(req, res){
    res.json(req.user); //req.user added and populated by userByID, below
};

exports.userById = function(req, res, next, id){
    //console.log('exports.userById = function(req, res, next, id){ - id: '+ id);
    User.findOne({
        _id : id
    }, function(err, user){
        if(err){
            return next(err);
        } else {
            req.user = user; // add `user` property to req
            next(); // pass control to next middleware
        }
    });
};

exports.usersByLastName = function(req, res, next, LName){
    User.findOne({
        lastName : LName
    }, function(err, user){
        if(err){
            return next(err);
        } else {
            req.user = user; // add `user` property to req
            next(); // pass control to next middleware
        }
    });
};

exports.update = function(req, res, next){
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user){
        if(err){
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function(req, res, next){
    req.user.remove(function(err){
        if(err){
            return next(err);
        } else {
            res.json(req.user);
        }
    });
};
exports.deleteAll = function(req, res, next){
    User.remover({}, function(err){
        if(err){
            return next(err);
        } else{
            res.send("All users deleted");
        }
    });
};




//Sign ins and outs
//====================================

// Create a new controller method that signin users
exports.signin = function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            // Use the Passport 'login' method to login
            req.login(user, (err) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res) {
	const user = new User(req.body);
	user.provider = 'local';
	//console.log("exports.signup = function(req, res) { ");
	// Try saving the User
	user.save((err) => {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			
			// Login the user
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					//res.json(user);
                    return res.redirect('/');
				}
			});
		}
	});
};

exports.renderSignin = function(req, res, next){
    if(!req.user){
        res.render('signin', {
            title : 'Sign in form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignup = function(req, res, next){
    if(!req.user){
        res.render('signup', {
            title : 'Sign up form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
    //console.log("in 'saveOAuthUserProfile'");
    //console.log("profile: " + JSON.stringify(profile));
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, (err, user) => {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {
                //console.log("in 'saveOAuthUserProfile', !user");
				// Set a possible base username
				const possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : 'guest');
                //console.log("possibleUsername: " + possibleUsername);
				// Find a unique available username
				User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
                    //console.log("in 'findUniqueUsername' callbaCKr");
					// Set the available user name 
					profile.username = availableUsername; //don't know where this came from
					//console.log("new user profile: " + JSON.stringify(profile) + "available username: " + availableUsername);
                    //console.log("available username: " + availableUsername);
					// Create the user
					user = new User(profile);

					// Try saving the new user document
					user.save(function(err) {
						// Continue to the next middleware
						return done(err, user);
					});
				});
			} else {
				// Continue to the next middleware
				return done(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.redirect('/');
};

// Authentications
exports.requiresLogin = function(req, res, next){
    if(!req.isAuthenticated()) {
        return res.status(401).send({
            message : 'User is not logged in'
        });
    }
    next();
};