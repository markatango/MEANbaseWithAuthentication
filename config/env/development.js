module.exports = {
    db : 'mongodb://localhost/mean-book',
    sessionSecret : 'spongecake3_14159',
    
    facebook : {
        client_ID : '1810545222521709',
        client_secret : 'ea8d226016b3b411c755cd66371ea82c',
        callbackURL : 'http://localhost:3000/oauth/facebook/callback'
    },
    google:{
        client_ID : '600050337927-hsm7emi3olu26b2o68u29qvgjq1v2aq9.apps.googleusercontent.com',
        client_secret : 'tIQRFsrgQ_7VZnpHSZgINOUE',
        callbackURL : 'http://localhost:3000/oauth/google/callback'
    },
    twitter :{
        consumer_key : '5SGIpyN3VdEiXKmhZd15uwCLi',
        consumer_secret : 'l9wTPWphHaOOFSpwqihvGarFHkf0UBaVYeu5TtkJywliiB9ur5',
        callbackURL : 'http://localhost:3000/oauth/twitter/callback',
    }
}

/*

Twitter Application Settings
Your application's Consumer Key and Secret are used to authenticate requests to the Twitter Platform.
Access level	Read and write (modify app permissions)
Consumer Key (API Key)	lw3C8RrcW9FzuW4LGDqhnGAlX (manage keys and access tokens)
Callback URL	None
Callback URL Locked	No
Sign in with Twitter	Yes
App-only authentication	https://api.twitter.com/oauth2/token
Request token URL	https://api.twitter.com/oauth/request_token
Authorize URL	https://api.twitter.com/oauth/authorize
Access token URL	https://api.twitter.com/oauth/access_token

*/