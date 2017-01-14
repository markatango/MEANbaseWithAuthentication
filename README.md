# MEANbaseWithAuthentication
Basic MEAN stack application with authentication, blog posting, and chat capability.

This is a _working_ implementation of the tutorial code described in the book, *MEAN Web Development,1st ed.* by 
Amos A. Haviv, published by PACKT Publishing. 

The book does a really good job of explaining how things work and why you put things were you do, but the code is buggy and may not 
work under all conditions.  I found problems using Chrome and Google OAuth for example. See fixes, below.

The main improvements in the code in this repository include:

1) Making Node module versions _explicit_.  The version numbers for these modules were taken from the 2nd edition of the book, where 
I noticed the author himself removed most of the version modifiers and just declared specific versions to use.  If I had to pick one
annoying thing about my experience using Node, it is the rate of change and inconsistent forwards/backwards compatibility of node packages.
Here is the ```package.json``` file I used:

```
{
  "name": "MEAN",
  "version": "0.0.3",
  "dependencies": {
    "body-parser": "1.15.2",
    "compression": "1.6.0",
    "connect-flash": "0.1.1",
    "connect-mongo": "1.3.2",
    "cookie-parser": "1.4.3",
    "ejs": "2.5.2",
    "express": "4.14.0",
    "express-console": "^0.1.1",
    "express-session": "1.14.1",
    "method-override": "2.3.6",
    "mongoose": "4.6.5",
    "morgan": "1.7.0",
    "multer": "^1.2.1",
    "passport": "0.3.2",
    "passport-facebook": "2.1.1",
    "passport-google-oauth": "1.0.0",
    "passport-local": "1.0.0",
    "passport-twitter": "1.0.4",
    "socket.io": "1.4.5"
  }
}
```

2) Fixed the missing ```hashbang``` problem caused by using Chrome browser with Google OAuth. See [here](https://github.com/meanjs/mean/issues/535). 
The book already gave a fix for a similar problem caused by Facebook OAuth.  Kudos to ```github``` user ```ppotoplyak``` for the correct
fix.  The revised code in ```/public/application.js``` is:

```
...
if (window.location.hash === '#_=_' || window.location.hash === '#') {
    //Fixing facebook bug with redirect
    window.location.hash = '#!';
  } else if(window.location.hash.length === 0) {
    // Without this, after G+ auth we started getting:
    // Uncaught Error: [$location:ihshprfx] Invalid url "https://streetspin.com/#", missing hash prefix "#!"
    // needs to be root caused at some point
    window.location.hash = '#!/';
  }
...
```
3) Added a reference to a ```PORT``` environment variable, so you could start the server on a different port without modifying the code. 
So, in ``` /server.js``` we have:
```
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
...
app.listen(process.env.PORT);
module.exports = app; 

console.log('Server running at http://localhost:' + process.env.PORT);
```
4) Fixed the argument passed to the MongoStore constructor in ```config/express.js```. This may have been one of the 'version
number' problems.  Correct instantiation, taken from [the source](https://github.com/jdesboeufs/connect-mongo) :
```
...
var mongoStore = new MongoStore({
        mongooseConnection: db.connection
    });
...
```
5) The ```providerUserProfile``` object in ```config/strategies/facebook.js``` has an ```email``` element that is supplssed to be filled 
from profile.emails[0].  But I couldn't get Facebook OAuth to return this item.  So I eliminated it from the initial definition of 
```providerUserProfile``` and added it later like this:
```
var providerUserProfile = {
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            fullName : profile.displayName,
            username : profile.username,
            provider : 'facebook',
            providerId : profile.id,
            providerData : providerData
        };
        
profile.email = profile.emails ? profile.emails[0].value : "example@localhost.com";
```
Ok, it's an ugly hack but I just wanted to get on with the code.  Any and all suggestions to get the email thing working will be appreciated.

There were other minor little typo things which I forgot to write down at the time, so ```diff``` the codes if you really want to know.  \
I complained once to a friend that I much 
preferred Windows ```.msi``` files over open source package managers because the ```.msi``` files just work (most of the time). He is of the 
"there are no _problems_ only _opportunities_" mindset:  Things that don't work are opportunities to dig in
and find out what is supposed be going on so you can fix things yourself.  Hmm.  Actually, I did get a warm fuzzy glow chasing down 
the fixes, and have to admit I do feel more confident about my grasp of MEAN having had this experience.  Can't say I believe PACKT planned that...




  





