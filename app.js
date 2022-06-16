var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var partials = require('express-partials');

// 建立express物件app
var app = express();

// 引用./routes/index.js模組之路由檔案
var routes = require('./routes/index.js');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cookieSession({
	key: 'node', 
	secret: 'Pp@CcU2016'
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

module.exports = app;