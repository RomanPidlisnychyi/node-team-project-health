const mongoose = require("mongoose");

const calorieSchema = new mongoose.Schema({
  userParams: {
    growth: { type: Number, required: true },
    age: { type: Number, required: true },
    currentWeight: { type: Number, required: true },
    desiredWeight: { type: Number, required: true },
    bloodGroup: { type: Number, required: true },
  },
  //   productsNotRecommended: [
  //     {
  //       name: { type: String, required: false },
  //     },
  //   ],
});

const calorieModel = mongoose.model("Сalorie", calorieSchema);

module.exports = calorieModel;
