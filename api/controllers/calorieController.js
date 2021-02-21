const calorieModel = require("../models/calorieModel");
const userModel = require("../models/userModel");

const getRecommendedDailyCalorieNorm = async (req, res) => {
  const { growth, age, currentWeight, desiredWeight, bloodGroup } = req.body;

  const dailyCalorieNorm =
    10 * currentWeight +
    6.25 * growth -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight);

  res.status(201).send({
    message: `Your recommended daily calorie norm: ${dailyCalorieNorm} cal.`,
  });
};

// const updateUserParams = async (req, res) => {
//   console.log("req.body:", req.body);
//   console.log("req.params:", req.params);

//   // const createUserParams = await calorieModel.create(req.body);
//   const createUserParams = await userModel.create({
//     ...req.body,

//   });
//   console.log("createUserParams:", createUserParams);

//   const {
//     growth,
//     age,
//     currentWeight,
//     desiredWeight,
//     bloodGroup,
//   } = createUserParams;

//   const dailyCalorieNorm =
//     10 * currentWeight +
//     6.25 * growth -
//     5 * age -
//     161 -
//     10 * (currentWeight - desiredWeight);

//   // console.log("getListNotRecomendedProducts:", getListNotRecomendedProducts());

//   // users.splice(targetUserIndex, 1);

//   res.status(201).send({
//     message: `Your recommended daily calorie norm: ${dailyCalorieNorm} cal.111111111111`,
//   });
// };

module.exports = {
  getRecommendedDailyCalorieNorm,
  // updateUserParams,
};
