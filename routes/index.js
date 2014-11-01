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

	res.render('result', { title: num})
	
});

router.get('/craigs', function(req, res) {
    res.render("craigs");
})

router.get('/searching', function(req, res) {
    var val = req.query.search;
    
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
"%20where%20location%3D%22sfbay%22%20and%20type%3D%22jjj%22%20and%20query%3D%22" + val + "%22&format=" +
"json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    console.log(url);

    request(url, function(err, resp, body) {
        body = JSON.parse(body);
        if(!body.query.results.RDF.item) {
            craig = "No results found. Try Again.";
        } else {
            craig = body.query.results.item[0]['about'];
        }
    });

    res.send(craig);
    //res.send("WHEEE");
});



module.exports = router;
