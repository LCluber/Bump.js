var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var fs            = require('fs');
//routes
var route_root    = require('./routes/root');
var route_doc     = require('./routes/doc');

var app = express();

var environment = process.env.NODE_ENV;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public/img/
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/dist',   express.static(path.join(__dirname, '../dist')));
app.use('/zip',    express.static(path.join(__dirname, '../zip')));

// add <script src="//localhost:35729/livereload.js?snipver=1" async="" defer=""></script>
// for livereload of grunt-contrib-watch
if (environment === 'development')
  app.use(require('connect-livereload')({
    port: 35729
  }));

app.use('/doc', route_doc);
app.use('/', route_root);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (environment === 'development')
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('_error', {
      message: err.message,
      error: err
    });
  });

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('_error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
