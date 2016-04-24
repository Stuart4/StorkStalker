var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* Start of shit going down*/
var hashmap = require('hashmap');

var uidToSocketMap = new hashmap.HashMap();

var connectSocketToUid = function (socket, uid) {
  uidToSocketMap.set(uid, socket);
};

var getSocketFromUid = function(uid) {
  return uidToSocketMap.get(uid);
};
    
/* End of shit going down*/

var routes = require('./routes/index');
var dashboard = require('./routes/dashboard');
var user_info = require('./routes/user_info');
var users = require('./routes/users');
var tracking = require('./routes/tracking');

user_info.setConnectSocketToUid(connectSocketToUid);
user_info.setGetSocketFromUid(getSocketFromUid);
tracking.setConnectSocketToUid(connectSocketToUid);
tracking.setGetSocketFromUid(getSocketFromUid);
/*
var connectSocketToUid = function(socket, uid) {
  tracking.connectSocketToUid(socket, uid);
};
*/

var easypost = require('./routes/easypost');
easypost.hashMap = tracking.hashMap;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/tracking', tracking.router);
app.use('/easypost', easypost.router);
app.use('/dashboard', dashboard);
app.use('/user_info', user_info.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {
  app: app,
  connectSocketToUid: connectSocketToUid
};