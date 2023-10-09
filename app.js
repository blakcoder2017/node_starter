const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
//importing routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//############### MIDDLEWARE STACK
//### Global middlewares

//Set security http
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//rate limit - limit the nuber of request from an IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

///Data sanitization against noSQL query injection
app.use(mongoSanitize());

//Data sanitization against cross-site attacks xss

//Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

///serving static files
app.use(express.static(`${__dirname}/public`));

//###Personal middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Missing route request (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
//############### END OF MIDDLEWARE STACK
app.use(globalErrorHandler);
module.exports = app;
