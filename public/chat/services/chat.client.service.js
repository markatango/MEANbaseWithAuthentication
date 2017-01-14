angular.module('chat').service('Socket', ['Authentication', '$location', '$timeout', function(Authentication, $location, $timeout){
    if(Authentication.user){
        this.socket = io();// ?? where is io() coming from ??
    } else {
        $location.path('/');
    };
    
    this.on = function(eventName, callback){
        if (this.socket){
            this.socket.on(eventName, function(data){
                // trick to enable data-binding between socket.io and angularJS
                // uses window.setTimer() function
                $timeout(function(){
                    callback(data);
                });
            });
        }
    };
    
    this.emit = function(eventName, data){
        if(this.socket){
            this.socket.emit(eventName, data);
        }
    };
    
    this.removeListener = function(eventName){
        if(this.socket){
            this.socket.removeListener(eventName);
        }
    };
    
}]);