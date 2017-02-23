var express = require('express');
var router = express.Router();

var work = require('./api/work');
var blog = require('./api/blog');
var contact = require('./api/contact');

router.use('/work', work);
router.use('/blog', blog);
router.use('/contact', contact);

module.exports = router;
