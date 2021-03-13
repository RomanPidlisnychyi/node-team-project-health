const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  getProductsByQuery,
  getProductsByQueryNew,
  getTitlesByLang,
} = require('../controllers/productController');

const productRouter = Router();

productRouter.get('/', asyncWrapper(getProductsByQuery));
productRouter.get('/query', asyncWrapper(getProductsByQueryNew));
productRouter.get('/titles', asyncWrapper(getTitlesByLang));

module.exports = productRouter;
