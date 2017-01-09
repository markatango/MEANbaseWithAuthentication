module.exports = function(req, res, next){
    console.log("req.body log: " + JSON.stringify(req.body));
    next();
}