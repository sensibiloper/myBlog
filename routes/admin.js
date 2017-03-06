var express = require('express');
var router = express.Router();
var credentials = require('../credentials');

var db = require('../lib/mysqlpool');
var pool = db.pool;
var mysql = db.mysql;

var Q = require('q');

router.all('/*', function(req, res, next){
  req.app.locals.layout = 'admin/main';
  next();
});

router.all('/:path?', function(req, res, next){
  var path = req.params.path;
  if(!req.session.isLogin){
    res.redirect('../login')
  }
  next();
});

router.get('/',function(req, res, next){
  res.redirect('/index');
});

router.use('/study',require('./admin/study'));

router.get('/index',function(req,res,next){
    res.render('admin/index');
});

router.get('/home', function(req, res, next){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'select home_subject, home_text, DATE_FORMAT(home_cd, "%Y-%c-%e %r")as home_cd,'
                +'DATE_FORMAT(home_fd, "%Y-%c-%e %r")as home_fd from BLOG_HOME';
    Q.ninvoke(connection, 'query', query)
    .then(function(result){

      console.log(result[0][0]);
      var subject = result[0][0].home_subject;
      var text = result[0][0].home_text;
      var date  = result[0][0].home_cd;
      var lastEditDate = result[0][0].home_fd;

      if(lastEditDate !==null && lastEditDate !== undefined){
        date = lastEditDate;
      }
      res.render('admin/home/input',{
                                      subject : subject,
                                      text : text,
                                      date : date
                                    });

      connection.release();
    })
    .fail(function(err){
      console.error(err);
      res.status(500)
      .send(err);
      connection.release();
    });
  });
});

router.post('/home', function(req, res){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var params = {
      home_subject : req.body.subject,
      home_text : req.body.text
     };

    var query = 'update blog_home set home_subject = ' + mysql.escape(params.home_subject);
        query += ', home_text=' + mysql.escape(params.home_text);
        query += ', home_fd = now()';
        console.log(query);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      res.redirect('./home');
      connection.release();
    })
    .fail(function(err){
      res.state(500)
      .send(err);
    });
    connection.release();
  });
});



module.exports = router;
