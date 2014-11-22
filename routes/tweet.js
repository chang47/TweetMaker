var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var OAuth2 = require('OAuth').OAuth2;
var https = require('https'); 
var passport = require('passport');
OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
/*var oauth2 = require('simple-oauth2')({
  clientID: '5468db667e506698595b8d77',
  clientSecret: 'b3cbde5bc28ec2df57dd0e7f61d5fe44',
  site: 'https://api.bufferapp.com',
  authorizationPath: '/oauth2/authorize',
  tokenPath: '/1/oauth2/token.json'
});*/

var key = "5468db667e506698595b8d77";
var secret = 'b3cbde5bc28ec2df57dd0e7f61d5fe44';
var oauth2 = new OAuth2(key, secret, 'https://api.bufferapp.com', null,
        '/1/oauth2/token.json', null);

var count = 1;

router.post('/call', function(req, res) {
    var url = "https://api.bufferapp.com/1/profiles.json&pretty=true";
    var tweets = req.body; //@TODO what does this grab?
    console.log(tweets);
/*    request(url, function(error, response, html) {
        if(!error && function(error, response, html) {
            //api calls...
        });
    })*/
    res.send("You did it!");
});

// tweets can be 117 characters long and the URL are 
// 23 characters long/
router.post('/maketweets', function(req, res) {
    var url = req.body.url;
    var tweets = [];
    request(url, function(error, response, html) {
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $('p').each(function(i, element) {
                // 0 to 112 = 113 characters
                var string = $(this).text().substring(0, 112);
                if(string.charAt(111) == ' ') {
                    string = string.substring(0, 111);
                }
                tweets.push(string + '... ' + url);
            });
            //return results
            //console.log(tweets.toString());
            var json = JSON.parse(JSON.stringify(tweets));
            //console.log(json);
            res.json(json);
        } else {
        	res.send('error');
        }
    });
});

router.get('/test', function(req, res) {
    console.log("zzzz " + oauth2);
    res.send(oauth2);
})


router.get('/provider2', function(req, res) {
    /*console.log(oauth2);
    res.send(oauth2);*/
    res.redirect('https://bufferapp.com/oauth2/authorize?client_id=5468db667e506698595b8d77&redirect_url=&response_type=code');
});

//try this
router.get('/access', function(req, res) {
    console.log(req.query['code']);
    oauth2.getOAuthAccessToken(req.query['code'], {
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/tweet/access'
    }, function(e, access_token) {
        if(e) {
            console.log(e);
            res.send("Didn't work");
        } else {
            console.log("access token: ");
            console.log(access_token);
            //req.session.oauth = {};
            //req.session.oauth.token = access_token;
            res.send('worked!')
            //res.redirect()
            //api call command
/*            var options = {
                hostname: 'api.twitter.com',
                path: '/1.1/statuses/user_timeline.json?screen_name=joshchang43',
                headers: {
                    Authorization: "Bearer " + access_token
                } 
            };

            https.get(options, function(result) {
                var buffer = '';
                result.setEncoding('utf8');
                result.on('data', function(data) {
                    buffer += data;
                });
                result.on('end', function(){
                    var tweets = JSON.parse(buffer);
                    console.log(tweets);
                });
            });
            res.send(access_token);*/
        }
    });

});


router.get('/auth', function(req, res) {
    res.redirect(authorization_uri);
});

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://bufferapp.com/oauth2/authorize',
    tokenURL: 'https://api.bufferapp.com/1/oauth2/token.json',
    clientID: '5468db667e506698595b8d77',
    clientSecret: 'b3cbde5bc28ec2df57dd0e7f61d5fe44',
    callbackUR: '/tweet/callback'
    }, function(accessToken, refreshToken, profile, done) {
        console.log(accessToken);
    }
));

router.get('/provider', passport.authenticate('provider'));

//Note on buffer you manually selected to come back here.
router.get('/callback2', passport.authenticate('provider', {failureRedirect: '/tweet/failure',
                                                            successRedirect: '/tweet/success'}
));

router.get('/callback', function(req, res) {
    res.send(oauth2);
    var code = req.query['code'];
    console.log(code);
    console.log('oauth2: ' + oauth2);
/*    for(var key in oauth2) {
        console.log("key " + key + ' value ' + oauth2[key]);
        for(var key2 in oauth2[key]) {
            console.log("key2 " + key2 + 'value2' + oauth2[key][key2]);
        }
    }*/
    oauth2.authCode.getToken({
        redirect_uri: '/tweet/callback',
        client_id: '5468db667e506698595b8d77',
        client_secret: 'b3cbde5bc28ec2df57dd0e7f61d5fe44',
        redirect_url: '/tweet/done',
        code: req.query['code'],
        grant_type: 'authorization_code'
    }, function (error, result) {
        if(error) {
            console.log("Error message " + error.message);
            console.log(result);
        }
  //      token = oauth2.accessToken.create(result);
        //console.log(token);
        res.send(result);
    });
});

router.get('/success', function(req, res) {
    res.send('success');
});

router.get('/failure', function(req, res) {
    res.send('failure');
});

module.exports = router;