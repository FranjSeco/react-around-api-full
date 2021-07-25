/* eslint-disable no-undef */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth')
const { celebrate, Joi } = require('celebrate');

const {BadRequest, NotAllowed} = require('../middlewares/errorHandling');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const cors = require('cors');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '60db8d23102c602dbc268f75', // paste the _id of the test user created in the previous step
//   };

//   next();
// });

app.use(cors());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(5),
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(5),
  }).unknown(true),
}), login);

// authorization
app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  if(err.statusCode === 500) {
    res.status(500).send({ message: 'An error occurred on the server' });
  } else if (err.statusCode === 401) {
    throw new NotAllowed('Something went wrong');
  } else if (err.statusCode === 400) {
    throw new BadRequest('Bad Request');
  }

});

app.listen(PORT, () => {
  console.log(`Link to the server: ${PORT}`);
});
