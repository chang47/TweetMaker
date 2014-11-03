var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var jsdom = require('jsdom');


var routes = require('./routes/index');
var users = require('./routes/users');
var tweet = require('./routes/tweet');

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

app.get('/', function(req, res) {
    res.render("craigs");
})

app.get('/searching', function(req, res) {

    var val = req.query.search;
    
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
"%20where%20location%3D%22sfbay%22%20and%20type%3D%22jjj%22%20and%20query%3D%22" + val + "%22&format=" +
"json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    console.log(url);

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
