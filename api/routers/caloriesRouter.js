const { Router } = require("express");
const calorieRouter = Router();

const { getRecommendedDailyCalorieNorm } = require("../controllers/calorieController");
const { asyncWrapper } = require("../helpers/asyncWrapper");

console.log("asyncWrapper:", asyncWrapper);

calorieRouter.get("/", asyncWrapper(getRecommendedDailyCalorieNorm));
// calorieRouter.post("/:id", authorizeUser, asyncWrapper(getRecommendedDailyCalorieNorm));

module.exports = calorieRouter;
