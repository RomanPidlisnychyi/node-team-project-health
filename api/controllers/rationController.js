const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

const rationModel = require("../models/rationModel");
const { NotFoundError, ValidationError } = require("../errors/errors");

const addProduct = async (req, res, next) => {
  const { date, product, weight } = req.body;
  const userId = req.user._id;

  const userRation = await rationModel.findOne({
    $and: [{ userId }, { date }],
  });
  if (!userRation) {
    const newRation = await rationModel.create({
      ...req.body,
      userId,
      rationItems: [
        {
          product,
          weight,
        },
      ],
    });

    return res.status(201).json(newRation);
  }

  const productExist = userRation.rationItems.find(
    (item) => item.product === product
  );
  if (!productExist) {
    const ration = await rationModel.findOneAndUpdate(
      { $and: [{ userId }, { date }] },
      {
        $push: {
          rationItems: {
            product,
            weight,
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(ration);
  }

  const newWeight = productExist.weight + weight;
  const updatedProduct = { product, weight: newWeight };

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

  const rationToUpdate = await rationModel.findOne({ userId });

  if (!rationToUpdate) {
    throw new NotFoundError("there is no ration for this user");
    // res.status(400).json("there is no ration for this user");
  }

  const rationId = rationToUpdate._id;

  const lastUpdate = await rationModel.findOneAndUpdate(
    { userId },
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
    product: Joi.string().required(),
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
    product: Joi.string(),
    weight: Joi.number(),
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
