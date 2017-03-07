var express = require('express');
var router = express.Router();
var Q = require('q');

var db = require('../lib/mysqlpool');
var pool = db.pool;
var mysql = db.mysql;

/* GET home page. */
router.get('/', function(req, res, next) {
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'select HOME_SUBJECT, HOME_TEXT, DATE_FORMAT(HOME_CD, "%Y-%c-%e %r")as HOME_CD,'
                +'DATE_FORMAT(HOME_FD, "%Y-%c-%e %r")as HOME_FD from BLOG_HOME';
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      var subject = result[0][0].home_subject;
      var text = result[0][0].home_text;

      text = text.replace(/\n/g, "<br />");
      res.render('index',
                  { subject : subject,
                    text : text
                  });
      connection.release();
    })
    .fail(function(err){
      res.status(500)
      .render('error');
    connection.release();

    })

  });


});

module.exports = router;
