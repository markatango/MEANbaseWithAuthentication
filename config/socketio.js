var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');
const configureChat = require('../app/controllers/chat.server.controller');

module.exports = function(server, io, mongoStore){
    io.use(function(socket, next){ // intercetp handshaking
        cookieParser(config.sessionSecret)(socket.request, {}, // parse handshake request and retrieve sessionId
                                         function(err){
            var sessionId = socket.request.signedCookies['connect.sid'];
            mongoStore.get(sessionId, function(err, session){
                socket.request.session = session;
                
                // populate session's user object
                passport.initialize()(socket.request, {}, function(){
                    passport.session()(socket.request, {}, function(){
                        if(socket.request.user){
                            next(null, true);
                        } else {
                            next(new Error('socket.io: User is not authenticated'), false);
                        }
                    })
                });
            });
        });
    });
    
    io.on('connection', function(socket){
       configureChat(io, socket);
    });
};
