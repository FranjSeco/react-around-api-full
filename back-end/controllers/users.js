const bcrypt = require('bcryptjs');
const UserModel = require('../models/users');
const jwt = require('jsonwebtoken');

const { NotFoundError } = require('../middlewares/errorHandling');

const currentUser = (req, res) => {
  UserModel.findById(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { runValidators: true, new: true },
  )
    .then(user => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      res.send(user)
    })
    // .catch(err => res.send(err))
    .catch(next)
}

const getAllUsers = (req, res) => {
  UserModel.find({})
    .then((users) => { res.status(200).send({ data: users }); })
    .catch((err) => { res.status(400).send(err); });
}

const getUser = (req, res) => UserModel.findById(req.params._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('No user with matching ID found');
    }
    return res.status(200).send({ data: user });
  })
  // .catch(
  //   (err) => {
  //   if (err.name === 'CastError') {
  //     res.status(400).send({ message: err });
  //   } else {
  //     res.status(500).send({ message: 'Internal Server Error' });
  //   }
  // }
  // );

  .catch(next)

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
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(400).send({ message: err });
    //   }
    //   res.status(500).send({ message: err });
    // });
    .catch(next)
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
        throw new NotFoundError('No user with matching ID found');
      }
      return res.status(200).send({ data: user });
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
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });

      res.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      res.status(200).send({ token });
    })
    .catch(next)
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
