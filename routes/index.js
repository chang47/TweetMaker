var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser')


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Tweet Generator' });
});

router.post('/result', function(req, res) {
	var url = req.body.url
	try {
    	var Spooky = require('spooky');
	} catch (e) {
    	var Spooky = require('../lib/spooky');
	}

	var spooky = new Spooky({
		child: {
			transport: 'http',
		},
		casper: {
			logLevel: 'debug',
			verbose: true,
		}
	}, function(err) {
		if(err) {
			e = new Error('Failed to initialize SpookyJS');
			e.details = err;
			throw e;
		}
	
		spooky.start(url);
		spooly.then(function() {
			this.emit('hello', 'Hello, from ' this.evaluate(function() {
				return document.title;
			}));
		});
		spooky.run();
	});
	
	spooky.on('error', function (e, stack) {
	    console.error(e);
	    if (stack) {
	        console.log(stack);
	    }
	});

	res.render('result', {title: url})



}, function(err, doc) {
	if(err) {
		res.send("there is a problem");
	} else {
		res.send("It worked!");
	}
})

module.exports = router;
