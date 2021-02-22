const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const { authorize } = require('../controllers/authController');
const { getProducts, getRationByData, pushRationByData2, pushProductsToDB, getAllTitles, getCurrentUser, updateUserParams} = require('../controllers/userController');
const { validateUserParams } = require("../validation/userParamsValidator");

const userRouter = Router();

// userRouter.get('/', asyncWrapper(register));
userRouter.get('/products', asyncWrapper(getProducts));
userRouter.get('/infobyday', asyncWrapper(getRationByData));
// userRouter.get('/pushtodb', asyncWrapper(pushProductsToDB));
userRouter.get('/titles', asyncWrapper(getAllTitles));

userRouter.get("/current", authorize, asyncWrapper(getCurrentUser));
userRouter.patch(
  "/params",
  authorize,
  validateUserParams,
  asyncWrapper(updateUserParams)
);

module.exports = userRouter;

//* GET http://localhost:3001/users/current  - приватный энд-поинт на проверку текущего юзера
//* и его параметров для коррекции
//* PATCH http://localhost:3001/users/params  - приватный энд-поинт на обновление параметров
//* текущего юзера   и   получение дневной нормы ккал
