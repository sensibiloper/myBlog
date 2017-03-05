var express = require('express');
var router  = express.Router();
var db = require('../../lib/mysqlpool');
var pool = db.pool;
var mysql = db.mysql;
var Q = require('q');

router.get('/category', function(req, res, next){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'select * from BLOG_STUDY_DIV';
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result[0]);
      res.render("admin/study/category", {divs : result[0]});
      connection.release();
    })
    .fail(function(err){
      console.error(err);
      connection.release();
    })
  })
});

router.get('/div/:idx/delete', function(req, res, next){
  var idx = req.params.idx;
  console.log(idx);
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'delete from BLOG_STUDY_DIV where DIV_IDX = ' + mysql.escape(idx);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result);
      res.redirect('back');
      connection.release();
    })
    .fail(function(err){
      console.error(err);
      connection.release();
    });
  });
});

router.post('/div', function(req, res, next){
  var idx = req.body.DIV_IDX;
  console.log(idx);
  if(!req.body.DIV_NAME){
    console.log('err')
    return;
  }
  Q.ninvoke(pool,'getConnection')
  .then(function(connection){
    var query = "";
    if(idx==-1){
      query = "insert into BLOG_STUDY_DIV (DIV_NAME) values ("+ mysql.escape(req.body.DIV_NAME) +")";
    }else{
      query = "update BLOG_STUDY_DIV set DIV_NAME = " + mysql.escape(req.body.DIV_NAME) +
              "where DIV_IDX = " + mysql.escape(idx);
    }

    console.log(query);

    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      res.redirect('./category');
      connection.release();
    })
    .fail(function(err){
      res.status(500).send(err);
      connection.release();
    });
  });
});

router.get('/categ/:idx', function(req, res, next){
  var idx = req.params.idx;
  console.log(idx);
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'select a.CATEGORY_IDX, a.CATEGORY_NAME, a.DIV_IDX, b.DIV_NAME ' +
                'from blog_study_category as a '+
                'left outer join blog_study_div as b '+
                'on a.div_idx = b.div_idx '+
                'where a.div_idx = '+mysql.escape(idx);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      res.json(result[0]);
      connection.release();
    })
    .fail(function(err){
      console.log(err);
      connection.release();
    });
  });
});

router.post('/categ', function(req, res, next){
  if(!req.body.CATEGORY_NAME){
    return;
  }

  var params = {
    category_idx : req.body.CATEGORY_IDX,
    div_idx : req.body.DIV_IDX,
    cate_name : req.body.CATEGORY_NAME
  };

  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = "";
    if(params.category_idx == -1){
      query = "insert into BLOG_STUDY_CATEGORY (DIV_IDX,CATEGORY_NAME)"+
              " values ("+mysql.escape(params.div_idx)+", "+mysql.escape(params.cate_name)+")";
    }else{
      query = "update BLOG_STUDY_CATEGORY set "+
                    " DIV_IDX = " + mysql.escape(params.div_idx) + ", " +
                    " CATEGORY_NAME = " + mysql.escape(params.cate_name) +
                    " where  CATEGORY_IDX = " + mysql.escape(params.category_idx);
    }
    console.log(query);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result);
      res.json({success:'ture'});
      connection.release();
    })
    .fail(function(err){
      console.error(err);
      connection.release();
    });
  });
});

router.get('/categ/:idx/delete', function(req, res, next){
  var idx = req.params.idx;
  console.log(idx);
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = 'delete from BLOG_STUDY_CATEGORY where CATEGORY_IDX = ' + mysql.escape(idx);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result);
      res.redirect('back');
      connection.release();
    })
    .fail(function(err){
      console.error(err);
      connection.release();
    });
  });
});

router.get('/ajax_study_div', function(req, res, next){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = "select DIV_IDX, DIV_NAME from BLOG_STUDY_DIV";
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      res.json(result[0]);
      connection.release();
    })
    .fail(function(err){
      console.log(err);
      connection.release();
    });
  });
});

router.post('/ajax_study_cate', function(req, res, next){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var div_idx = req.body.idx;
    var query = "select CATEGORY_IDX, CATEGORY_NAME from BLOG_STUDY_CATEGORY where DIV_IDX = " + mysql.escape(div_idx);
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
  })
  .fail(function(err){
    console.error(err);
  });
});

router.post('/form_write', function (req, res){
  console.log('fomr_wirte')
  var params = req.body;
  if(params.CATEGORY_IDX == -1) {
    res.send({save:false,message:'분류를 선택하세요'});
    return;
  }
  if(!(params.STUDY_SUBJECT&&params.STUDY_COMMENT&&params.STUDY_CONTENT)){
    res.send({save:false,message:'제목, 부제목, 내용을 확인하세요'});
    return;
  }
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = "";
    if (params.STUDY_IDX == -1){
      console.log('-1 insert');
      query = "insert into BLOG_STUDY (STUDY_SUBJECT, STUDY_COMMENT, STUDY_CONTENT, CATEGORY_IDX)"+
              "values ("+mysql.escape(params.STUDY_SUBJECT)+", "+mysql.escape(params.STUDY_COMMENT)+", " +
              mysql.escape(params.STUDY_CONTENT)+", "+mysql.escape(params.CATEGORY_IDX)+")";
    }else {
      console.log('others update');
      query = "update BLOG_STUDY set "+
              "STUDY_SUBJECT = "+mysql.escape(params.STUDY_SUBJECT)+","+
              "STUDY_COMMENT = "+mysql.escape(params.STUDY_COMMENT)+","+
              "STUDY_CONTENT = "+mysql.escape(params.STUDY_CONTENT)+","+
              "STUDY_FID = sysdate(), "+
              "CATEGORY_IDX = "+mysql.escape(params.CATEGORY_IDX)+
              "where STUDY_IDX = "+mysql.escape(params.STUDY_IDX);
    }
    console.log(query);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result);
      res.json(result);
      connection.release();
    })
    .fail(function(err){
      console.log(err);
      connection.release();
    });
  });
})

router.get('/delete/:idx', function(req, res){
  console.log(req.params.idx);
  if(!req.params.idx)return;
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = "delete from BLOG_STUDY where STUDY_IDX = " + mysql.escape(req.params.idx);
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      res.redirect('back');
      connection.release();
    })
    .fail(function(err){
      console.log(err)
      connection.release();
    })
  })
});

router.get('/write', function(req, res, next){
  var idx = req.query.idx || -1;
  var data = {};
  if(req.query.idx){
    console.log('enter')
    Q.ninvoke(pool, 'getConnection')
    .then(function(connection){
      var query = "select a.*, b.CATEGORY_NAME, c.DIV_NAME "+
                  "from blog_study as a " +
                  "left outer join blog_study_category as b "+
                  "on a.category_idx = b.category_idx "+
                  "left outer join blog_study_div as c "+
                  "on b.div_idx = c.div_idx "+
                  "where a.study_idx ="+mysql.escape(idx);
      Q.ninvoke(connection, 'query', query)
      .then(function(result){
        data.UPDATE = true;
        data.STUDY_IDX = result[0][0].STUDY_IDX;
        data.STUDY_SUBJECT = result[0][0].STUDY_SUBJECT;
        data.STUDY_COMMENT = result[0][0].STUDY_COMMENT;
        data.STUDY_CONTENT = result[0][0].STUDY_CONTENT;
        data.CATEGORY_IDX = result[0][0].CATEGORY_IDX;
        data.DIV_NAME = result[0][0].DIV_NAME;
        data.CATEGORY_NAME = result[0][0].CATEGORY_NAME;
        console.log(data);
        res.render('admin/study/write', {data : data});
        connection.release();
      })
      .fail(function(err){
        console.log(err);
        connection.release();
      });
    });
  }else{
    data.STUDY_IDX = idx;
    res.render('admin/study/write', {data : data});
  }
});

router.get('/list', function(req, res, next){
  Q.ninvoke(pool, 'getConnection')
  .then(function(connection){
    var query = "SELECT *, DATE_FORMAT(STUDY_CRD, '%Y-%c-%e %r')as CREATE_DATE, DATE_FORMAT(STUDY_FID, '%Y-%c-%e %r')as FIX_DATE FROM BLOG_STUDY ORDER BY STUDY_IDX DESC";
    Q.ninvoke(connection, 'query', query)
    .then(function(result){
      console.log(result[0]);
      res.render('admin/study/list', {lists:result[0]});
      connection.release();
    })
    .fail(function(err){
      console.log(err);
      connection.release();
    });
  });
});

module.exports = router;
