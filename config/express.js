const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const passport = require('passport');
const helmet = require('helmet');


const app = express();
// secure apps by setting various HTTP headers
app.use(helmet());
app.use(cors({ credentials: true, origin: true }))
app.use(cookieParser());

if (env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attach them to res.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// enable detailed API logging in dev env
if (env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }),
  );
}

app.use(passport.initialize());
app.use(passport.session());
passport.use('jwt', strategies.jwt);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// mount all routes on /api path
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

if (env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    }),
  );
};

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
