var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('about', {
    something : 'test',
    pageTestScript : '/qa/tests-user.js'
  });
});
module.exports = router;
