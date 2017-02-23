var express = require('express');
var router = express.Router();
var credentials = require('../credentials');

router.get('/', function(req, res, next){
  console.log(req.session);
  if(!req.session.isLogin){
    res.redirect('./admin/login');
  }else{
    res.render('admin/main',{user:req.session.admin.id});
  }
});

router.get('/login', function(req, res, next){
  res.render('admin/login',{
    isLogin:true
  });
});

router.post('/login', function(req, res, next){
  var id = req.body.id;
  var password = req.body.password;
  console.log('id = '+id +', pw = '+password);
  console.log(req.body);

  if(id && password){
    console.log('here');
    console.log(credentials.admin);
    console.log(id+', '+password);
    var isLogin = credentials.admin.id == id && credentials.admin.password == password ? true : false;

    if(isLogin){

      req.session.isLogin = isLogin;
      req.session.admin = req.body;
console.log('isLogin beyond');
      res.render('admin/main');
    }else{
      res.redirect('./login');
    }

  }
});

module.exports = router;
