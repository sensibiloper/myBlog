var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  console.log('work');
  req.session.logined = 'logined';
  console.log(req.session.logined);
  res.render('nav/work');
  next();
});

router.get('/detail/:id',function(req, res, next){
  next();
});

module.exports = router;
