const express = require("express");
const router = express.Router();

const { signUp } = require('../controllers/authController');
const { signIn } = require('../controllers/authController');
const { logout } = require('../controllers/authController');

const { validateCreateUser } = require('../controllers/authController');
const { validateSingIn } = require('../controllers/authController');
const { verifiEmail } = require('../controllers/authController');
const { authorize } = require('../controllers/authController');

router.post(
    "/register",
    validateCreateUser,
    signUp
);

router.put("/login", validateSingIn, signIn);

router.get("/verify/:verificationToken", verifiEmail);

router.patch("/logout", authorize, logout);

module.exports = router;
