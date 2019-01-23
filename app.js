//this section tells the express application the applications to use
const express = require('express'); // telling the node app to use the express library
const path = require('path'); //path module provides utilities for working with file and dir paths
const favicon = require('serve-favicon'); // module to serve up a favicon on the pages tab in the browser
const logger = require('morgan'); // morgan HTTP request logger middleware
const cookieParser = require('cookie-parser'); // middle ware tro parse cookie
const bodyParser = require('body-parser'); //middle ware to parse the body of a html request
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database');

const winston = require('winston');
const morgan = require('morgan');

//initial routes set up by express generator we wont be using these in our api
var index = require('./routes/index');
var users = require('./routes/users');



// create connection to MongoDB
try{
  mongoose.set('useNewUrlParser',true);
  mongoose.set('useCreateIndex',true);
  mongoose.connect(config.database);
}
catch(e){
  console.log(e.message);
  winston.error(e.message);
}

//add route for our api
const api = require('./routes/api');

//initializing the application to use express
const app = express();
app.use(logger('combined', { stream: winston.stream}));

// add Cors support before any routing
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept," +
        "Authorization");
    res.header('Access-Control-Expose-Headers', 'Authorization');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});
app.use(passport.initialize());
winston.info('Started passport');
winston.add(winston.transports.File,{"filename":
        "error.log", "level":"error"});

winston.error("Something went wrong");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// app.use('/', index);
app.use('/api', api);
app.use('/users', users);

app.get('/', function(req, res) {
    res.send('Page under construction.');
});

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



