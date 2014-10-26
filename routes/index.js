var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser')


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Tweet Generator' });
});

router.post('/result', function(req, res) {
	var urlTitle;
	var Spooky = require('spooky');
	var casper = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        casper.start('http://en.wikipedia.org/wiki/Web_scraping', function() {
	    	urlTitle = this.echo("I'm loaded.");
		});
		casper.run();
	});
	var num = 0;
	for(var i = 0; i < 1000000; i++) {
		num++;
	}
	res.render('result', { title: num})
	
});

module.exports = router;
