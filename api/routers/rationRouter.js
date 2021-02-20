const { Router } = require("express");
const { asyncWrapper } = require("../helpers/asyncWrapper");
const {
  addProduct,
  deleteProduct,
  validateId,
} = require("../controllers/rationController");
const { authorize } = require("../controllers/authController");

const rationRouter = Router();

rationRouter.post("/", authorize, asyncWrapper(addProduct));
rationRouter.delete("/:id", authorize, validateId, asyncWrapper(deleteProduct));

module.exports = rationRouter;
