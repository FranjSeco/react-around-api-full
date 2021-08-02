/* eslint-disable no-undef */
const userRouter = require('express').Router();

function validateUrl(string) {
  return validator.isURL(string);
}

const { celebrate, Joi } = require('celebrate');

const {
  getUser, getAllUsers, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

userRouter.get('/me', currentUser);

userRouter.get('/', getAllUsers);

userRouter.get('/:_id', celebrate({
  body: Joi.object({
    id: Joi.string().required().hex(),
  }),
}), getUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}),
updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .custom(validateUrl)
      .required(),
  }),
}),
updateAvatar);

module.exports = userRouter;
