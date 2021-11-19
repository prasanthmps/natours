// const fs = require('fs');
const path = require(`path`);
const express = require(`express`);
const morgan = require(`morgan`);
const AppError = require(`./utils/appError.js`);
const globalErrorHandler = require(`./controllers/errorController.js`);
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require(`./routes/tourRoutes.js`);
const userRouter = require(`./routes/userRoutes.js`);
const reviewRouter = require(`./routes/reviewRoutes.js`);
const viewRouter = require(`./routes/viewRoutes.js`);

const app = express();

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

/////////////////////////
//Middle wares

//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip please try agian in an hour'
});
app.use('/api', limiter);

//Body parser,reading data from body to req.body
app.use(
  express.json({
    limit: '10kb'
  })
);
app.use(cookieParser());

//Data sanitization aganist NOSQL query injection
app.use(mongoSanitize());

//Data sanitization aganist XSS
app.use(xss());

//prervent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//Test middleware
app.use((req, res, next) => {
  // console.log('Hello form the middle ware - 2');
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  // console.log(req.headers);
  next();
});

//////////////////////////////
//routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // console.log(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
