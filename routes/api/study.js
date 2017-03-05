var express = require('express');
var router  = express.Router();
var db = require('../../lib/mysqlpool');
var pool = db.pool;
var mysql = db.mysql;
var Q = require('q');

router.get('/', function(req, res, next){
  var values = {};
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'select * from blog_study_div';
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      values.div = result[0];
      console.log(values.div[0].DIV_NAME);
      res.render("nav/study",{div : values.div});
      connection.release();
    })
    .fail(function(err){
      console.error(err);
      connection.release();
    })
  })

  router.post('/ajax_study', function(req, res){
    var div_idx = req.body.DIV_IDX, category_idx = req.body.CATEGORY_IDX;
    var page = (req.body.page-1)*5;
    var page_block = 5;

    Q.ninvoke(pool, 'getConnection')
    .then(function(connection){
      var query = "";

      if(category_idx!= -1){
          console.log('category_idx = '+category_idx);
          query = 'select STUDY_IDX, STUDY_SUBJECT, STUDY_COMMENT, STUDY_CONTENT from BLOG_STUDY '+
                  'where category_idx ='+mysql.escape(category_idx)+
                  ' LIMIT '+page+', '+page_block;
      }else{
        if(!div_idx){
          console.log("all");
          query = 'select STUDY_IDX, STUDY_SUBJECT, STUDY_COMMENT, STUDY_CONTENT from BLOG_STUDY LIMIT '+page+', '+page_block;
        }else{
          console.log('all div');
          query = 'select STUDY_IDX, STUDY_SUBJECT, STUDY_COMMENT, STUDY_CONTENT from BLOG_STUDY ' +
                  'where category_idx in (' +
                    'select category_idx from blog_study_category where div_idx ='+
                      mysql.escape(div_idx)+') '+
                  'LIMIT '+page+', '+page_block;
        }
      }
      console.log(query);
      Q.ninvoke(connection, 'query', query)
      .then(function(result){
        console.log(result[0]);
        res.json(result[0]);
        connection.release();
      })
      .fail(function(err){
        console.error(err);
        connection.release();
      });
    });
  });

  router.post('/ajax_study/div', function(req, res){
    var idx = req.body.idx;
    Q.ninvoke(pool, 'getConnection')
    .then(function(connection){
      var query = "select CATEGORY_IDX, CATEGORY_NAME from blog_study_category";
      if(idx){
        query += " where div_idx = "+mysql.escape(idx);
      }
      console.log(query);
      Q.ninvoke(connection, 'query', query)
      .then(function(result){
        res.json(result[0]);
        connection.release();
      })
      .fail(function(err){
        console.log(err);
        connection.release();
      })
    })
    console.log(idx);
  });
});

module.exports = router;
