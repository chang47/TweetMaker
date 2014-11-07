var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');


var routes = require('./routes/index');
var users = require('./routes/users');
var tweet = require('./routes/tweet');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tweet')

var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(allowCrossDomain);
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    req.db = db;
    next();
});


app.get('/', function(req, res) {
    res.render("craigs");
})

app.get('/searching', function(req, res) {


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

app.get('/add', function(req, res) {
    res.render('add', { title: "Add new Data Point"});
});

app.get('/test', function(req, res) {
    var db = req.db
    var url = req.body.url
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
    res.send("nice try");
});

app.post('/added', function(req, res) {
    var db = req.db
    var url = req.body.url
    var collection = db.get('usercollection');
    //var userTitle = scrape(url, db)
   


    res.location('/result')
    res.redirect('/result')

  /*  collection.insert({
        "title" : userTitle
    }, function(err, doc) {
        if (err) {
            res.send("There are errors");
        } else {
            res.location('/result')
            res.redirect('/result')
        }
    })*/
})

function scrape(url, db) {
    try {
        var Spooky = require('spooky');
    } catch (e) {
        var Spooky = require('../lib/spooky');
    }

    var spooky = new Spooky({
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

            spooky.start(
                'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
            spooky.then(function () {
                var title = this.emit('hello', 'Hello, from ' + this.evaluate(function () {
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
}

app.get('/result', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        console.log("This is " + docs);
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

app.get('/nodetube', function(req, res) {
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
            res.end($('title')).text();
        });
    });
});

/*app.use('/', routes);
app.use('/users', users);
app.use('/tweet', tweet);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
