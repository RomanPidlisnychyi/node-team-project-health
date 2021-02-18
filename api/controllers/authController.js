const Joi = require("joi");
const bcryptjs = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const UnauthorizedError = require("../errors/UnauthorizedError");

const signUp = async (req, res, next) => {
  try {
    const { password, name, email } = req.body;

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User with such email already exists" });
    }

    const passwordHash = await bcryptjs.hash(password, 4);

    const user = await userModel.create({
      name,
      email,
      password: passwordHash,
    });

    await sendVerificationEmail(user);

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
}

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    console.log(email);

    if (!user || user.status !== "Verified") {
      return res.status(400).send({ message: "Authentication failed" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    

    if (!isPasswordValid) {
      return res.status(400).send({ message: "Authentication failed" });
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60, //two days
    });

    await userModel.updateToken(user._id, token);

    return res.status(200).json({
      token: token,
      user: {
        email: email,
      },
    });

  } catch (err) {
    next(err);
  }
}

const logout = async (req, res, next) => {
  try {
    const user = req.user;

    await userModel.updateToken(user._id, null);

    return res.status(204).send({ message: "User was successfully logout" });
  } catch (err) {
    next(err);
  }
}

const authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      next(new UnauthorizedError("User not authorized"));
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      throw new UnauthorizedError("User not authorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
}

const sendVerificationEmail = async (user) => {
  try {
    const verificationToken = uuid.v4();

    await userModel.createVerificationToken(user._id, verificationToken);

    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: user.email,
      from: process.env.NODEMAILER_USER,
      subject: "Email verification",
      text: "Please varificate your email",
      html: `<p>Please varificate your <a href="http://localhost:3001/auth/verify/${verificationToken}"><strong>email</strong></a></p>`,
    };

    await sgMail.send(msg);

    console.log("Email send");
  } catch (err) {
    console.log(err);
  }
}

const verifiEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const userToVerify = await userModel.findByVerificationToken(
      verificationToken
    );

    if (!userToVerify) {
      return res.status(404).send({ message: "User not found" });
    }

    await userModel.verifyUser(userToVerify._id);

    return res.status(200).send({ message: "You're user successfully verified" });
  } catch (err) {
    next(err);
  }
}

const validateSingIn = (req, res, next) => {
  const signInRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = signInRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

const validateCreateUser = (req, res, next) => {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

module.exports = {
  signUp,
  signIn,
  logout,
  authorize,
  sendVerificationEmail,
  verifiEmail,
  validateSingIn,
  validateCreateUser,
};

















