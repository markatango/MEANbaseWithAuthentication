module.exports = function(app){
    
    var index = require('../controllers/index.server.controller'); // returns the render() method
    app.get('/', index.render);
}; // returns a function that takes one argument, app