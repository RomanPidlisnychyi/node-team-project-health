const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

const rationModel = require("../models/rationModel");
const productModel = require("../models/productModel");
const { NotFoundError, ValidationError } = require("../errors/errors");

const addProduct = async (req, res, next) => {
  const { date, productTitle, weight } = req.body;
  const userId = req.user._id;

  const productInDb = await productModel.findOne({ "title.ru": productTitle });
  const productId = productInDb._id;
  const calories = Math.round((productInDb._doc.calories * weight) / 100);

  const userRation = await rationModel.findOne({
    $and: [{ userId }, { date }],
  });
  if (!userRation) {
    const newRation = await rationModel.create({
      ...req.body,
      userId,
      rationItems: [
        {
          productId,
          weight,
          calories,
        },
      ],
    });

    return res.status(201).json(newRation);
  }

  const productExist = userRation.rationItems.find(
    (item) => item.productId === productId.toString()
  );
  if (!productExist) {
    const ration = await rationModel.findOneAndUpdate(
      { $and: [{ userId }, { date }] },
      {
        $push: {
          rationItems: {
            productId,
            weight,
            calories,
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(ration);
  }

  const newWeight = productExist.weight + weight;
  const newCalories = Math.round((productInDb._doc.calories * newWeight) / 100);
  const updatedProduct = {
    productId,
    weight: newWeight,
    calories: newCalories,
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

  res.status(201).json(updatedRation);
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;
  const date = req.body.date;

  const rationToUpdate = await rationModel.findOne({
    $and: [{ userId }, { date }],
  });

  if (!rationToUpdate) {
    throw new NotFoundError("there is no ration for this user at this date");
  }

  const rationId = rationToUpdate._id;

  const lastUpdate = await rationModel.findOneAndUpdate(
    { $and: [{ userId }, { date }] },
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
    return res.status(400).send();
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
    throw new ValidationError("missing required field");
  }

  next();
};

const validateUpdateRation = (req, res, next) => {
  const validationRules = Joi.object({
    date: Joi.string(),
    productTitle: Joi.string(),
    weight: Joi.number(),
    // calories: Joi.number(),
  }).min(1);

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    throw new ValidationError("missing required field");
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
