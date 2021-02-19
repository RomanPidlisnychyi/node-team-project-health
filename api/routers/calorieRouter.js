const { Router } = require("express");
const calorieRouter = Router();

const { asyncWrapper } = require("../helpers/asyncWrapper");
const {
  getRecommendedDailyCalorieNorm,
} = require("../controllers/calorieController");
const {
  getListNotRecomendedProducts,
} = require("../controllers/notRecomProductController");

// const { authorizeUser } = require("./middlewares/authMiddleware");

//* POST http://localhost:3000/calories публичный энд-поинт на получение дневной нормы ккал
calorieRouter.post(
  "/",
  asyncWrapper(getRecommendedDailyCalorieNorm)
  //   asyncWrapper(getListNotRecomendedProducts)
);

//* POST http://localhost:3000/calories приватный энд-поинт на получение дневной нормы ккал
// calorieRouter.post(
//   "/",
//   authorizeUser,
//   asyncWrapper(getRecommendedDailyCalorieNorm),
// );

//* GET http://localhost:3000/calories публичный энд-поинт на получение списка нерекомендуемых продуктов
calorieRouter.get("/", asyncWrapper(getListNotRecomendedProducts));

module.exports = calorieRouter;
