const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { register } = require('../controllers/userController');
const { getProducts, getRationByData, pushRationByData2, pushProductsToDB, getAllTitles} = require('../controllers/userController');

const userRouter = Router();

// userRouter.get('/', asyncWrapper(register));
userRouter.get('/products', asyncWrapper(getProducts));
userRouter.get('/infobyday', asyncWrapper(getRationByData));
// userRouter.get('/pushtodb', asyncWrapper(pushProductsToDB));
userRouter.get('/titles', asyncWrapper(getAllTitles));

module.exports = userRouter; 

// const express = require("express");
// const router = express.Router();

// module.exports = router;