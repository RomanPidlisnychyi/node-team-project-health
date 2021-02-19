const mongoose = require("mongoose");

const notRecomProductSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

const notRecomProductModel = mongoose.model(
  "Not-recommended-product",
  notRecomProductSchema
);

module.exports = notRecomProductModel;
