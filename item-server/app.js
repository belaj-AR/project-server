require('dotenv').config();
var express = require('express');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
var indexRouter = require('./routes/index');


var app = express();

app.use(cors());

if (process.env.STAGE === 'test') {

    mongoose.connect(process.env.DB_TEST, {useNewUrlParser: true}); 

} else if (process.env.STAGE === 'dev') {

    mongoose.connect(process.env.DB_DEV, {useNewUrlParser: true});  
    
} else if (process.env.STAGE === 'prod', {useNewUrlParser: true}) {

    mongoose.connect(process.env.DB_PROD, {useNewUrlParser: true});
}



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/', indexRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
