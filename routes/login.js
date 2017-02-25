var express = require('express');
var router = express.Router();
var credentials = require('../credentials');

var db = require('../lib/mysqlpool');
var pool = db.pool;
var mysql = db.mysql;

var Q = require('q');

router.get('/', function(req, res, next){
  res.render('admin/login',{
    layout:'layout',
    isLogin:true
  });
});

router.post('/', function(req, res, next){
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
      res.redirect('./admin/index');
    }else{
      res.redirect('./admin/login');
    }

  }
});

module.exports = router;
