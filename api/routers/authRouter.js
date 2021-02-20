const { Router } = require('express');
const {
  validateCreateUser,
  validateSingIn,
  verifiEmail,
  authorize,
  signUp,
  signIn,
  logout,
} = require('../controllers/authController');

const router = Router();

router.post('/register', validateCreateUser, signUp);

router.put('/login', validateSingIn, signIn);

router.get('/verify/:verificationToken', verifiEmail);

router.patch('/logout', authorize, logout);

module.exports = router;
