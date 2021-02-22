const { Router } = require("express");
const notRecomProductRouter = Router();

const { asyncWrapper } = require("../helpers/asyncWrapper");
const {
  getListNotRecomendedProducts,
} = require("../controllers/notRecomProductController");
const { validateUserParams } = require("../validation/userParamsValidator");

notRecomProductRouter.post(
  "/",
  validateUserParams,
  asyncWrapper(getListNotRecomendedProducts)
);

module.exports = notRecomProductRouter;

//* POST http://localhost:3001/notrecomendedproducts публичный энд-поинт
//* на получение дневной нормы ккал и списка нерекомендуемых продуктов
