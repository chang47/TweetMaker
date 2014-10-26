var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser')


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Tweet Generator' });
});

module.exports = router;
