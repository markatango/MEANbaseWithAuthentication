// create afunction that confiures routes with the one and only express function then exports the express function as 'app'

//configure the routes with the express module
var config = require('./config'), // makes config variables visible through recursive search starting from config.js
    express = require('express'), // this is the native express module
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    compress = require('compression'),
    console = require('express-console')(8000),
    session = require('express-session'),
    bodyLogger = require('../app/custom_middleware/console.logger.mw.js'),
    flash = require('connect-flash'),
    passport = require('passport');
    

module.exports = function(){
    
    var app = express();
    if (process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    } else {
        app.use(compress());
    }
    
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    
    
    
    app.use(session({
        saveUninitialized : true,
        resave : true,
        secret : config.sessionSecret // see./config tree
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    
    if (process.env.NODE_ENV === 'development'){
        app.use(bodyLogger);
    } 
    
    // routes. Each route may pass any err to the next middleware, in this case the static page.
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app); // passes err to the next middleware
    require('../app/routes/articles.server.routes.js')(app); // passes err to the next middleware
    
    app.use(express.static('./public'));  // below routes so we look here after exhausting the routes
    
    return app;
}; 
    