process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

var mongoose = require('./config/mongoose'), // load mongoose first
    express = require('./config/express'),
    passport = require('./config/passport');

// for mongoStore for socket.io
var db = mongoose();
var app = express(db); // pass db to express for mongoStore
var passport = passport();

app.listen(process.env.PORT); // see express.js, which returns `server`. this the thing that `listens`.
module.exports = app;  // pass it along 

console.log('Server running at http://localhost:' + process.env.PORT);
