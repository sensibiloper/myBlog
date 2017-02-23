var express = require('express');
var router = express.Router();


router.get('/',function(req, res, next){
  res.render('nav/blog');
});

module.exports = router;
