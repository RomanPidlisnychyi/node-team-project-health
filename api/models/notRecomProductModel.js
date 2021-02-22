const mongoose = require("mongoose");

const notRecomProductSchema = new mongoose.Schema({
  categories: { type: Array, required: true },
  weight: { type: Number, required: true },
  title: { type: Object, required: true },
  calories: { type: Number, required: true },
  groupBloodNotAllowed: { type: Array, required: true },
});

const notRecomProductModel = mongoose.model(
  "Not-recommended-product",
  notRecomProductSchema
);

module.exports = notRecomProductModel;
