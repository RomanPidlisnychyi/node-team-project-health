const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');
const rationModel = require('../models/rationModel');
const productModel = require('../models/productModel');
const ErrorConstructor = require('../errors/ErrorConstructor');

const addProduct = async (req, res, next) => {
  const { date, productTitle, weight } = req.body;
  const userId = req.user._id;

  const productInDb = await productModel.findOne({ 'title.ru': productTitle });
  if (!productInDb) {
    next(new ErrorConstructor(404));
  }
  const calories = Math.round((productInDb._doc.calories * weight) / 100);
  const groupBloodNotAllowed = productInDb._doc.groupBloodNotAllowed;

  const userRation = await rationModel.findOne({
    $and: [{ userId }, { date }],
  });
  if (!userRation) {
    const newRation = await rationModel.create({
      ...req.body,
      userId,
      rationItems: [
        {
          title: productTitle,
          weight,
          calories,
          groupBloodNotAllowed,
        },
      ],
    });

    return res.status(201).json(newRation.rationItems[0]);
  }

  const productExist = userRation.rationItems.find(
    item => item.title === productTitle
  );
  if (!productExist) {
    const ration = await rationModel.findOneAndUpdate(
      { $and: [{ userId }, { date }] },
      {
        $push: {
          rationItems: {
            title: productTitle,
            weight,
            calories,
            groupBloodNotAllowed,
          },
        },
      },
      { new: true }
    );

    return res
      .status(201)
      .json(ration.rationItems[ration.rationItems.length - 1]);
  }

  const newWeight = productExist.weight + weight;
  const newCalories = Math.round((productInDb._doc.calories * newWeight) / 100);
  const updatedProduct = {
    title: productTitle,
    weight: newWeight,
    calories: newCalories,
    groupBloodNotAllowed,
  };

  await rationModel.findOneAndUpdate(
    { $and: [{ userId }, { date }] },
    { $pull: { rationItems: productExist } },
    { new: true }
  );

  const updatedRation = await rationModel.findOneAndUpdate(
    { $and: [{ userId }, { date }] },
    { $push: { rationItems: updatedProduct } },
    { new: true }
  );

  res
    .status(201)
    .json(updatedRation.rationItems[updatedRation.rationItems.length - 1]);
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;
  const date = req.body.date;

  const rationToUpdate = await rationModel.findOne({
    $and: [{ userId }, { date }],
  });

  if (!rationToUpdate) {
    next(new ErrorConstructor(404));
  }

  const rationId = rationToUpdate._id;

  const lastUpdate = await rationModel.findByIdAndUpdate(
    rationId,
    {
      $pull: { rationItems: { _id: productId } },
    },
    { new: true }
  );

  if (lastUpdate.rationItems.length === 0) {
    await rationModel.findByIdAndDelete(rationId);

    return res.status(204).send();
  }

  return res.status(204).send();
};

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    next(new ErrorConstructor(404));
  }

  next();
};

const validateCreateRation = (req, res, next) => {
  const validationRules = Joi.object({
    date: Joi.string().required(),
    productTitle: Joi.string().required(),
    weight: Joi.number().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    next(new ErrorConstructor(404));
  }

  next();
};

const validateUpdateRation = (req, res, next) => {
  const validationRules = Joi.object({
    date: Joi.string(),
    productTitle: Joi.string(),
    weight: Joi.number(),
  }).min(1);

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    next(new ErrorConstructor(404));
  }

  next();
};

module.exports = {
  addProduct,
  deleteProduct,
  validateId,
  validateCreateRation,
  validateUpdateRation,
};
