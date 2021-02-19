const { calorieModel } = require("../models/calorieModel");

const getRecommendedDailyCalorieNorm = async (req, res) => {
  console.log("req.params:", req.params);

    const sum = 2500;
//   const sum = calorieModel.find();

  res
    .status(201)
    .send({ message: `Your recommended daily calorie norm: ${sum} cal.` });
  // .json(sun)
};

module.exports = {
  getRecommendedDailyCalorieNorm,
};
