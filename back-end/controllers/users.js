const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');

const NotFoundError = require('../errors/NotFound');
const NotAuthorized = require('../errors/NotAuthorized');

const currentUser = (req, res, next) => {
  // const {name, about} = req.body;
  UserModel.findById(
    req.user._id,
    // { name, about },
    // { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      const { _doc: { ...props } } = user;
      res.status(200).send({ data: props });
    })
    // .catch(err => res.send(err))
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  UserModel.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email
    }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id,
    { avatar },
    { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      } else {
        const { _doc: { ...props } } = user;
        res.status(200).send({ data: props });
      }
    })
    .catch(next);
};

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotAuthorized('Not Authorized');
      }

      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  currentUser,
};
