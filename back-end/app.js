/* eslint-disable no-undef */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');

const BadRequest = require('./errors/BadRequest');
const NotFoundError = require('./errors/NotFound');
const NotAuthorized = require('./errors/NotAuthorized');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/api-full', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(helmet());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '60db8d23102c602dbc268f75',
// paste the _id of the test user created in the previous step
//   };

//   next();
// });

app.use(requestLogger);

app.use(cors());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }).unknown(true),
}), login);

// AUTH

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.get('*', () => {
  throw new NotFoundError('Requested resource not found');
});

// app.use((err, req, res, next) => {
//   if (err.statusCode === 500) {
//     res.status(500).send({ message: 'An error occurred on the server' });
//   } else if (err.statusCode === 401) {
//     throw new NotAuthorized('Something went wrong');
//   } else if (err.statusCode === 400) {
//     throw new BadRequest('Bad Request');
//   }
// });

app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  if (err.name === 'ValidationError') statusCode = 400;
  else if (err.name === 'MongoError' && err.code === 11000) statusCode = 409;
  else if (err.name === 'Error') statusCode = 401;

  const { message = 'An error occurred on the server' } = err;

  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`Link to the server: ${PORT}`);
});
