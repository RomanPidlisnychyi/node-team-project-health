const { Router } = require('express');
const notRecomProductRouter = Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  getListNotRecomendedProducts,
  getListNotRecomendedProductsByCategory,
} = require('../controllers/notRecomProductController');
const { validateUserParams } = require('../validation/userParamsValidator');

notRecomProductRouter.post(
  '/',
  validateUserParams,
  asyncWrapper(getListNotRecomendedProducts)
);

notRecomProductRouter.get(
  '/:category/:bloodGroup',
  asyncWrapper(getListNotRecomendedProductsByCategory)
);

module.exports = notRecomProductRouter;
