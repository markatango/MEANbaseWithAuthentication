module.exports = function(io, socket){ // use in see socketio.js
    // notify users of new chatter
    // user infor is available from the socket.request.user  object
    io.emit('chatMessage', {
        type : 'status',
        text : 'connected',
        created : Date.now(),
        username : socket.request.user.username
    });
    
    //send message object
    socket.on('chatMessage', function(message){
        message.type = 'message';
        message.created = Date.now();
        message.username = socket.request.user.username;
        
        io.emit('chatMessage', message);
    });
    
    //handle disconnect event
    socket.on('disconnect', function(){
        io.emit('chatMessage', {
            type : 'status',
            text : 'disconnected',
            created : Date.now(),
            username : socket.request.user.username
        });
    });
};