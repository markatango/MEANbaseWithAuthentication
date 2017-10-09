// Load the module dependencies
const Article = require('mongoose').model('Article');


// Create a new error handling controller method
const getErrorMessage = function(err) {

	// If an internal MongoDB error occurs get the error message
	if (err.errors) {
		for(var errName in err.errors){
            if(err.errors[errName].message) return err.errors[errName].message;
        }
	} else {
		return 'Unknown server error';
	}
};

//CRUD
//==========================
exports.create = function(req, res){
    console.log("articles.server.controller: create");
    var article = new Article(req.body);
    article.creator = req.user;
    article.save(function(err){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });    
};
              
exports.list = function(req, res){
    console.log("articles.server.controller: list");
    Article.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, articles){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};

exports.read = function(req, res){
    console.log("articles.server.controller: read");
    res.json(req.article); //req.Article added and populated by ArticleByID, below
};

exports.articleById = function(req, res, next, id){
    console.log("articles.server.controller: articleById");
    Article.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, article){
        if(err) return next(err);
        if(!article) return next(new Error('Failed to laod article ' + id));
        req.article = article;
        next();
    });
};

exports.update = function(req, res){
    console.log("articles.server.controller: update");
    console.log("update req: " + req);  
    var article = req.article;
    article.title = req.body.title;
    article.content = req.body.content;
    article.save(function(err){
        if(err) {
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

exports.delete = function(req, res){
    req.article.remove(function(err){
        if(err){
            return res.status(400).send({
                message : getErrorMessage(err)
            });
        } else {
            res.json(req.article);
        }
    });
};

exports.deleteAll = function(req, res, next){
    console.log("articles.server.controller.deleteAll");
    Article.remove({}, function(err){
        if(err){
            return next(err);
        } else{
            res.send("All Articles deleted");
        }
    });
};

// Authorization
exports.hasAuthorization = function(req, res, next){
    console.log("articles.server.controller.hasAuthorization");
    if(req.article.creator.id != req.user.id){
        return res.status(403).send({
            message : 'User is not authorized'
        });
    }
    next();
};

