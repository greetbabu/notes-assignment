var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const MAX_FILE_SIZE = '10mb';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.text({limit: MAX_FILE_SIZE }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(err && err.message === 'request entity too large') {
    console.log(`Limit: ${err.limit / 1024**2} MB`)
    err.userAlert = `Maximum file size permitted is ${(err.limit / 1024**2).toFixed(2)} MB size, current file size is ${(err.length / 1024**2).toFixed(2)} MB `
    res.status(err.status).send(err);
  } else {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
