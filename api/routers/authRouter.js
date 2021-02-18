const { Router } = require('express');
const { logout } = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/logout', logout);

module.exports = authRouter;
