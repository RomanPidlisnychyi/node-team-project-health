const {
  Types: { ObjectId },
} = require("mongoose");
const rationModel = require("../models/rationModel");

const addProduct = async (req, res, next) => {
  const { product, weight } = req.body;
  const userId = req.user._id;

  const userRation = await rationModel.findOne({ userId });
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
  console.log(productExist);
  if (!productExist) {
    const ration = await rationModel.findOneAndUpdate(
      { userId },
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
  console.log(newWeight);

  const updatedRation = await rationModel.findOneAndUpdate(
    { userId },
    { rationItems: [{ product, weight: newWeight }] },
    { new: true }
  );

  res.status(201).json(updatedRation);
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;

  const rationToUpdate = await rationModel.findOne({ userId });

  if (!rationToUpdate) {
    res.status(400).json("there is no ration for this user");
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

    return res.status(204).json("ration deleted");
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

module.exports = {
  addProduct,
  deleteProduct,
  validateId,
};
