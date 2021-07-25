/* eslint-disable no-undef */
const userRouter = require('express').Router();

function validateUrl(string) {
  return validator.isURL(string);
}

const { celebrate, Joi } = require('celebrate');

const {
  getUser, getAllUsers, updateUser, updateAvatar, currentUser
} = require('../controllers/users');

userRouter.get('/me', currentUser)

userRouter.get('/', getAllUsers);

userRouter.get('/:_id', celebrate({
  body: Joi.object({
    id: Joi.string().required().hex(),
  }),
}), getUser);

// userRouter.post('/', createUser);

// userRouter.post('/', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().min(2).max(30),
//     password: Joi.string().required().min(5),
//   }),
// }), createUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), updateAvatar);

module.exports = userRouter;
