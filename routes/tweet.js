var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var OAuth2 = require('OAuth').OAuth2;
var https = require('https'); 

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

router.get('/done', function(req, res) {
    res.send("Your tweets have been successfully added");
});

router.get('/access', function(req, res) {
    var key = "BmXm38jfFzm3VkyyxJEfuH0nh";
    var secret = 'LhVejj0tonrXvdQNAAJ01Ww4SCw8hRLUW2AP0T7sgUDVmNwob0';
    var oauth2 = new OAuth2(key, secret, 'https://api.twitter.com/', null,
        'oauth2/token', null);

    oauth2.getOAuthAccessToken('', {
        'grant_type': 'client_credentials'
    }, function(e, access_token) {
        console.log("access token: ");
        console.log(access_token);
        var options = {
            hostname: 'api.twitter.com',
            path: '/1.1/statuses/user_timeline.json?screen_name=Joshchang43',
            headers: {
                Authorization: "bearer" + access_token
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
        res.send(access_token);
    });

});


module.exports = router;