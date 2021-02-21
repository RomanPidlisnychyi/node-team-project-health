const { Router } = require("express");
const calorieRouter = Router();

const { authorize } = require("../controllers/authController");
const { asyncWrapper } = require("../helpers/asyncWrapper");
const {
  getRecommendedDailyCalorieNorm,
  createUserParams,
} = require("../controllers/calorieController");
const { validateUserParams } = require("../validation/userParamsValidator");

//* POST http://localhost:3001/calories публичный энд-поинт на получение дневной нормы ккал
calorieRouter.post(
  "/",
  validateUserParams,
  asyncWrapper(getRecommendedDailyCalorieNorm)
);

//* PATCH http://localhost:3001/calories приватный энд-поинт на получение дневной нормы ккал
// calorieRouter.patch(
//   "/",
//   authorize,
//   validateUserParams,
//   asyncWrapper(createUserParams)
// );

module.exports = calorieRouter;
