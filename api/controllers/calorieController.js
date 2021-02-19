const calorieModel = require("../models/calorieModel");
const {
  getListNotRecomendedProducts,
} = require("../controllers/notRecomProductController");

const getRecommendedDailyCalorieNorm = async (req, res) => {
  // console.log("req.body:", req.body);
  
  const createUserParams = await calorieModel.create(req.body);
  console.log("createUserParams:", createUserParams);
  
  const { growth, age, currentWeight, desiredWeight, bloodGroup } = createUserParams;

  const dailyCalorieNorm =
    growth * 15 + age * 2 + (currentWeight - desiredWeight) + bloodGroup*10;

    console.log("getListNotRecomendedProducts:", getListNotRecomendedProducts());

  res.status(201).send({
    message: `Your recommended daily calorie norm: ${dailyCalorieNorm} cal. `,
  });
};

module.exports = {
  getRecommendedDailyCalorieNorm,
};
