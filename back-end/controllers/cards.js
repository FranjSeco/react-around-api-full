const CardModel = require('../models/cards');

const getCards = (req, res) => {
  CardModel.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(400).send(err));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Invalid data' });
      }
      res.status(200).send({ data: card });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err });
      }
      res.status(500).send({ message: err });
    });
};

const deleteCard = (req, res) => {
  CardModel.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send({
        data: card,
        message: 'Card deleted',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err });
      }
    });
};

const likeCard = (req, res) => {
  console.log(req.user._id);
  CardModel.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err });
      }
    });
};

const dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
