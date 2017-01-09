// either works when ejs is the view engine, but the second render function uses ejs

/*
exports.render = function(req, res){
    res.send("MEAN server Hello World");
};
*/

// use this to demonstrate ejs usage
/*exports.render = function(req, res){
    // see express.js
    res.render('index', { title : "MEAN Server Hello World" });
};*/


// use this to demonstrate session usage with Express
/*
exports.render = function(req, res){
    if(req.session.lastVisit){
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = "Last vist was at: "  + new Date();
    
    res.render('index', { 
        title : "MEAN Server Hello World",
        userFullName: req.user ? req.user.fullName : ''
    });
};

*/

// use this to demonstrate session usage with Angular service
// Qualify any form action with variab le `user` in `window` object
exports.render = function(req, res){
    res.render('index', {
        title : "Hello World",
        user: JSON.stringify(req.user) // render user as JSON in the browser window
    });
};