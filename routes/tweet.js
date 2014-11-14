var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

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
            console.log(json);
            res.json(json);
        } else {
        	res.send('error');
        }
    });
});


module.exports = router;