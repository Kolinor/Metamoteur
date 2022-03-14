var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mariadb = require('mariadb');
const config = require('./conf.json');

var recherchesRouter = require('./routes/recherches');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const pool = mariadb.createPool({
//   host: config.mariadb.host,
//   user: config.mariadb.user,
//   password: config.mariadb.password,
//   connectionLimit: config.mariadb.connectionLimit
// });

app.use(function(req, res, next) {
  // req.pool = pool;
  next();
});

app.use('/', recherchesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
