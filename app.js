var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var startRouter = require('./routes/start');
var joinRouter = require('./routes/join');
var handleRegiRouter = require('./routes/handleRegi');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var freeRouter = require('./routes/free');
var loginpageRouter = require('./routes/loginpage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/start', startRouter);
app.use('/join', joinRouter);
app.use('/handleRegi', handleRegiRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/free', freeRouter);
app.use('/loginpage', loginpageRouter);

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
