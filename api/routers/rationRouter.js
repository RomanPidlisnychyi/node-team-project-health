const { Router } = require("express");
const { asyncWrapper } = require("../helpers/asyncWrapper");
const {
  addProduct,
  deleteProduct,
  validateId,
  validateCreateRation,
  validateUpdateRation,
} = require("../controllers/rationController");
const { authorize } = require("../controllers/authController");

const rationRouter = Router();

rationRouter.post(
  "/",
  authorize,
  validateCreateRation,
  validateUpdateRation,
  asyncWrapper(addProduct)
);
rationRouter.delete(
  "/:id",
  authorize,
  validateId,
  validateUpdateRation,
  asyncWrapper(deleteProduct)
);

module.exports = rationRouter;
