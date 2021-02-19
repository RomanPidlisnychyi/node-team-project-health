const { Router } = require('express');
const { logout, authorized } = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/logout', authorized, logout);

module.exports = authRouter;
