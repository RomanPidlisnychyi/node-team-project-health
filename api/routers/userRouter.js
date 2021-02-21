const { Router } = require("express");
const { asyncWrapper } = require("../helpers/asyncWrapper");
const { authorize } = require("../controllers/authController");
const {
  getProducts,
  getRationByData,
  pushRationByData2,
  getCurrentUser,
  updateUserParams,
} = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/products", asyncWrapper(getProducts));
userRouter.get("/infobyday", asyncWrapper(getRationByData));
userRouter.get("/test", asyncWrapper(pushRationByData2));

userRouter.get("/current", authorize, asyncWrapper(getCurrentUser));
userRouter.patch("/params", authorize, asyncWrapper(updateUserParams));

module.exports = userRouter;


//* GET http://localhost:3001/users/current  - приватный энд-поинт на проверку текущего юзера
//* PATCH http://localhost:3001/users/params  - приватный энд-поинт на обновление параметров
//* текущего юзера и получение дневной нормы ккал