var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

router.post('/maketweets', function(req, res) {
    var url = req.body.url;
    var tweets = [];
    request(url, function(error, response, html) {
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $('p').each(function(i, element) {
                tweets.push($(this).text());
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
