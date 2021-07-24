const bcrypt = require('bcryptjs');
const UserModel = require('../models/users');
const jwt = require('jsonwebtoken');

const currentUser = (req, res) => {
  UserModel.findById(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { runValidators: true, new: true },
  )
  .then(user => res.send(user))
  .catch(err => res.send(err))
}

const getAllUsers = (req, res) =>
  {
    UserModel.find({})
    .then((users) => { res.status(200).send({ data: users }); })
    .catch((err) => { res.status(400).send(err); });
  }

const getUser = (req, res) => UserModel.findById(req.params._id)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: err });
    } else {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });

const createUser = (req, res) => {
  // const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(req.body.password, 10)
    .then(hash => {
      return UserModel.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash
      })
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err });
      }
      res.status(500).send({ message: err });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err });
      } else {
        res.status(500).send({ message: err });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err });
      } else {
        res.status(500).send({ message: err });
      }
    });
};



const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .then(payload => {
      req.user = payload;
      next();
    })
    .catch((err) => {
      // authentication error
      res.status(401).send({ message: err.message });
    })
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  currentUser
};
