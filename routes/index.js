var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser')


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Tweet Generator' });
});

router.get('/display', function(req, res) {
    res.render('display', {
        title: "Users"
    });
});

router.get('/searching', function(req, res) {


    request(url, function(err, resp, body) {
        body = JSON.parse(body);
        console.log(body);/*
        if(!body.query.results.RDF.item) {
            craig = "No results found. Try Again.";
        } else {
            craig = body.query.results.item[0]['about'];
        }*/
    });

    if(val == "word") {
        res.send("word");
    }
    res.send("WHEEE");
    //res.send("WHEEE");
});

//first authenticate, then redirect here, which if fails
//redirect back.
router.get('/add', function(req, res) {
    if(req.app.get('code') == '') {
        //res.redirect('/tweet/provider');
        res.send('failed');
    }
    var token = req.app.get('code');
    //req.app.set('code', '');
    console.log(req.url);
    res.render('add', { title: "Add new Data Point",
                        token: token});
});


router.get('/removeall', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.remove({});
    res.send("deleted everything")
});

/*
    Scrapes and adds first 30 elements from ycombinator into tweet DB
*/
router.get('/quickadd', function(req, res) {
    var db = req.db;
    var url = req.body.url;
    var collection = db.get('usercollection');
    //var userTitle = scrape(url, db)
    var val = "";
    request('http://news.ycombinator.com', function(error, response, html) {
        if(!error && response.statusCode == 200) {
            //console.log(html);
            var $ = cheerio.load(html);
            $('span.comhead').each(function(i, element) {
                var a = $(this).prev();
                var rank = a.parent().parent().text();
                var title = a.text();
                var url = a.attr('href');
                var subtext = a.parent().parent().next().children('.subtext').children();
                var points = $(subtext).eq(0).text();
                var username = $(subtext).eq(1).text();
                var comments = $(subtext).eq(2).text();

                var metadata = {
                    rank: parseInt(rank),
                    title: title,
                    url: url,
                    points: parseInt(points),
                    username: username,
                    comments: parseInt(comments)
                }
                collection.insert(metadata, function(err, doc) {
                    if(err) {
                        console.log("error");
                    } else {
                        console.log("it worked!");
                    }
                });
                console.log(metadata);
            });
        }
    });
    res.send("Added 30 elements into the DB");
});


/**
    The page sent to do the scraping on the backend. Redirects to result, 
    though nothing may be there, the result of asynchoronous action
    @TODO nothing
*/
router.post('/added', function(req, res) {
    var db = req.db
    var url = req.body.url
    var collection = db.get('usercollection');

    res.location('/result')
    res.redirect('/result')
})

/**
    Displays everything in the test DB
*/
router.get('/result', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        console.log("This is " + docs);
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

router.get('/nodetube', function(req, res) {
    request({uri: "http://youtube.com"}, function(err, res, body) {
        var self = this;
        self.items = newAray();
        if(err && res.statusCode !== 200) {
            console.log("Error");
        }
        jsdom.env({
            html: body,
            scripts: ['http://code.jquery.com/jquery-1.6.min.js']
        }, function(err, window){
            var $ = window.jQuery;
            console.log($('title').text());
            res.send($('title')).text();
        });
    });
});

module.exports = router;
