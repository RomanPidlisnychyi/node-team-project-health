const { Router } = require('express');
const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  validateCreateUser,
  validateSingIn,
  verifiEmail,
  authorize,
  signUp,
  signIn,
  logout,
} = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/register', validateCreateUser, asyncWrapper(signUp));

authRouter.put('/login', validateSingIn, asyncWrapper(signIn));

authRouter.patch('/logout', asyncWrapper(authorize), asyncWrapper(logout));

authRouter.get('/verify/:verificationToken', asyncWrapper(verifiEmail));

module.exports = authRouter;
