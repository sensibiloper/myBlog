var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var credentials = require('./credentials');

console.log(credentials.session.secret);

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var study = require('./routes/study');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.all('/*', function(req, res, next){
  req.app.locals.layout = 'layout';
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(credentials.session));
//{secret : credentials.session.secret, resave : false, saveUninitialized : true}
app.use(express.static(path.join(__dirname, 'public')));

//test querystring check
app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  console.log(res.locals.showTests);
  next();
});


app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/study', study);
app.use('/login', require('./routes/login'));
app.use('/api', api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
