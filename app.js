const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const formsRouter = require('./routes/forms');
const fillsRouter = require('./routes/fills');
const { db } = require('./db');

db.sync({ force: false });

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', formsRouter);
app.use('/', fillsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  if (err.status === 404) {
    return res.status(404).send({
      error: 'Это не тот путь, который ты ищешь! (нет такого)'
    })
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
