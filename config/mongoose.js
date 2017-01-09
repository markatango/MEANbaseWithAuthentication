var config = require('./config'), // looks for folder then finds config.js, et voila
    mongoose = require('mongoose'); // from node_modules

module.exports = function(){
    var db = mongoose.connect(config.db); // equiv:  var db = mongoose.connect('mongodb://localhost/mean-book');
    require('../app/models/user.server.model');    // returns mongoose.model('User', UserSchema);
    require('../app/models/article.server.model'); // returns mongoose.model('Article', ArticleSchema);
    return db;
};

// usage:
/*
var mongoose = require('./config/mongoose'); // refers to _this_ file
var db = mongoose(); // returns the connected database
*/