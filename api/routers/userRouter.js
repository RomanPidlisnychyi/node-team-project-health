const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { register } = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/', asyncWrapper(register));

module.exports = userRouter;
