const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  getProductsByQuery,
  getTitlesByLang,
} = require('../controllers/productController');

const productRouter = Router();

productRouter.get('/', asyncWrapper(getProductsByQuery));
productRouter.get('/titles', asyncWrapper(getTitlesByLang));

module.exports = productRouter;
