const CardModel = require('../models/cards');

const NotFoundError = require('../errors/NotFound');
const NotAuthorizedError = require('../errors/NotAuthorized');

const getCards = (req, res) => {
  CardModel.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res) => {
  CardModel.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      } else if (!card.owner._id === req.user._id) {
        throw new NotAuthorizedError('Not Authorized');
      } else {
        res.status(200).send({
          data: card,
          message: 'Card deleted',
        });
      }
    })
    .catch(next);
};

const likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      const { _doc: { ...props } } = card;
      return res.status(200).send(props);
    })
    .catch(next);
};

const dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      const { _doc: { ...props } } = card;
      return res.status(200).send(props);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
