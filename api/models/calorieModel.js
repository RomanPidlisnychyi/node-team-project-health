const mongoose = require("mongoose");

const calorieSchema = new mongoose.Schema({
  // params: {
  growth: { type: Number, required: true },
  age: { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  desiredWeight: { type: Number, required: true },
  bloodGroup: { type: Number, required: true },
  // },
});

const calorieModel = mongoose.model("Сalorie", calorieSchema);

module.exports = calorieModel;
