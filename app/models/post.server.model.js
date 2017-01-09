var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    author : {
        type : Schema.ObjectId,
        ref : 'User'  // populate from User model
    }        
});


mongoose.model('Post', PostSchema);


// usage:
/*var user = new User();
user.save();

var post = new Post();
post.author = user;
post.save();

// name of posts collection is 'posts'
Post.find().populate('author')/exec(function(err, posts){...});*/