var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tweet', function(req, res) {
  res.render('Tweet', { title: 'Tweet Generator' });
});

router.get('/tweet/result', function(req, res) {
  res.render('/tweet/result', { title: 'Tweet Generator2' });
});

module.exports = router;
