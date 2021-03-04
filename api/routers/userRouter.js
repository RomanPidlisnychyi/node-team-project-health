const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  authorize,
  getCurrentUser,
  updateRefreshToken,
} = require('../controllers/authController');
const {
  getRationByData,
  updateUserParams,
} = require('../controllers/userController');
const { validateUserParams } = require('../validation/userParamsValidator');

const userRouter = Router();

userRouter.get('/infobyday/:date', authorize, asyncWrapper(getRationByData));
userRouter.get('/current', authorize, asyncWrapper(getCurrentUser));
userRouter.get('/refresh', asyncWrapper(updateRefreshToken));
userRouter.patch(
  '/params',
  authorize,
  validateUserParams,
  asyncWrapper(updateUserParams)
);

module.exports = userRouter;
