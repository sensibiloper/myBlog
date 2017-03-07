var express = require('express');
var router = express.Router();
var credentials = require('../credentials');

var db = require('../lib/mysqlpool');
var pool = db.pool;
var mysql = db.mysql;

var Q = require('q');

router.get('/:idx', function(req, res){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'select * from BLOG_STUDY where STUDY_IDX = '+mysql.escape(req.params.idx);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result[0][0]);
      res.render('study', result[0][0]);
      connection.release();
    })
    .fail(function(err){
      console.error(err);
      connection.release();
    });
  });
});


module.exports = router;
