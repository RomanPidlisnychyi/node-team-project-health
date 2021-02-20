const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { register } = require('../controllers/userController');
const { getProducts, getRationByData, pushRationByData2} = require('../controllers/userController');

const userRouter = Router();

// userRouter.get('/', asyncWrapper(register));
userRouter.get('/products', asyncWrapper(getProducts));
userRouter.get('/infobyday', asyncWrapper(getRationByData));
userRouter.get('/test', asyncWrapper(pushRationByData2));

module.exports = userRouter;
