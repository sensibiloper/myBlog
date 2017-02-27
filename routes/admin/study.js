var express = require('express');
var router  = express.Router();

router.get('/category', function(req, res, next){
  res.render("admin/study/category");
});

module.exports = router;
