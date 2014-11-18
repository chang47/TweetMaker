var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var OAuth = require('OAuth');

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
/*router.post('/maketweets', function(req, res) {
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
});*/

router.get('/done', function(req, res) {
    res.send("Your tweets have been successfully added");
});

router.get('/access', function(req, res) {
    var OAuth2 = OAuth.OAuth2;
    var twitterConsumerKey = '';
    var twitterConsumerSecret = '';
    var oauth2 = new OAuth2(
        twitterConsumerKey,
        twitterConsumerSecret,
        'http://api.twitter.com/',
        null,
        'oauth2/token',
        null);
    oauth2.getOAuthAccessToken(
        '',
        {'grant_type': 'client_credentials'},
        function(e, access_token, refresh_token, results) {
            console.log('bearer: ', access_token);
            oauth2.get('protected url',
                access_token, function(e, data, res) {
                    if (e) return callback(e, null);
                    if (res.statusCode != 200) {
                        return callback(new Error(
                            'OAuth2 request failed: ' +
                            res.statusCode), null);
                    } 
                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        return callback(e, null);
                    }
                    return callback(e, data);
                });
        });
});


module.exports = router;