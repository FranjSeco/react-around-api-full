/* eslint-disable no-undef */
const userRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getAllUsers, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

userRouter.get('/me', currentUser);

userRouter.get('/', getAllUsers);

userRouter.get('/:_id', celebrate({
  body: Joi.object({
    id: Joi.string().required().hex().length(24),
  }),
}), getUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method),
  }),
}), updateAvatar);

module.exports = userRouter;
