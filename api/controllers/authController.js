const Joi = require('joi');
const bcryptjs = require('bcrypt');
const path = require('path');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const ErrorConstructor = require('../errors/ErrorConstructor');

const signUp = async (req, res, next) => {
  const { password, email } = req.body;

  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser) {
    next(new ErrorConstructor(409));
  }

  const passwordHash = await bcryptjs.hash(password, 4);

  const user = await userModel.create({
    ...req.body,
    password: passwordHash,
  });

  await sendVerificationEmail(user);

  return res.status(201).json({
    name: user.name,
    email: user.email,
  });
};

const signIn = async (req, res, next) => {
  const { email, password, params: reqParams } = req.body;

  const user = await userModel.findUserByEmail(email);

  if (!user || user.status !== 'Verified') {
    next(new ErrorConstructor(401));
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    next(new ErrorConstructor(401));
  }

  const accessToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });

  const refreshToken = await jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    }
  );

  const { name, params, _id: userId } = user;

  let updatedUser;

  if (
    !reqParams ||
    (params && params.age) ||
    (params && params.age && reqParams && reqParams.age)
  ) {
    updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        accessToken,
        refreshToken,
      },
      { new: true }
    );
  } else {
    updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        params: reqParams,
        accessToken,
        refreshToken,
      },
      { new: true }
    );
  }

  return res.status(200).json({
    token: {
      accessToken,
      refreshToken,
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    },
    user: {
      email,
      name,
      params: updatedUser.params,
    },
  });
};

const logout = async (req, res, next) => {
  const userId = req.user._id;

  await userModel.findByIdAndUpdate(userId, {
    accessToken: null,
    refreshToken: null,
  });

  return res.status(204).send();
};

const authorize = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization' || '');

  if (!authorizationHeader) {
    next(new ErrorConstructor(401));
  }
  const token = authorizationHeader.replace('Bearer ', '');

  let userId;
  try {
    userId = await jwt.verify(token, process.env.JWT_SECRET).id;
  } catch (err) {
    next(new ErrorConstructor(401));
  }

  const user = await userModel.findById(userId);
  if (!user || user.accessToken !== token) {
    next(new ErrorConstructor(401));
  }

  try {
    await jwt.verify(user.refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    next(new ErrorConstructor(401));
  }

  req.user = user;
  req.token = token;

  next();
};

const getCurrentUser = async (req, res, next) => {
  const accessToken = req.token;
  const { email, name, _id: userId, params } = req.user;

  const refreshToken = await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
  });

  await userModel.findByIdAndUpdate(userId, { refreshToken });

  return res.status(200).json({
    token: {
      accessToken,
      refreshToken,
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    },
    user: {
      email,
      name,
      params,
    },
  });
};

const updateRefreshToken = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization' || '');

  if (!authorizationHeader) {
    next(new ErrorConstructor(401));
  }
  const refreshToken = authorizationHeader.replace('Bearer ', '');

  let userId;
  try {
    userId = await jwt.verify(refreshToken, process.env.JWT_SECRET).id;
  } catch (err) {
    next(new ErrorConstructor(401));
  }

  const user = await userModel.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    next(new ErrorConstructor(401));
  }

  const newRefreshToken = await jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    }
  );

  await userModel.findByIdAndUpdate(userId, { refreshToken: newRefreshToken });

  return res.status(200).json({ refreshToken: newRefreshToken });
};

const sendVerificationEmail = async user => {
  const verificationToken = uuid.v4();

  await userModel.createVerificationToken(user._id, verificationToken);

  await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: user.email,
    from: process.env.NODEMAILER_USER,
    subject: `Приложение Health, ${user.name} подтвердите Вашу почту`,
    text: `${user.name} подтвердите Вашу почту перейдя по ссылке ${process.env.API_URL}/auth/verify/${verificationToken}`,
    html: `<div
            style="
                background: url('https://i.ibb.co/0YyWwmQ/bg1.jpg') no-repeat;
                display: flex;
                padding: 120px 25px;
                flex-direction: column;
                justify-content: center;
            "
        >
                <p style="font-size: 24px">
                    Приветствую ${user.name}! Для завершения регистрации пожалуйста
                    подтвердите свою почту
                    <br />
                    <a clicktracking=off href="${process.env.API_URL}/auth/verify/${verificationToken}">
                    <strong>>>> Кликни сюда для подтверждения <<<</strong>
                </a>
                </p>
        </div>`,
  };

  return await sgMail.send(msg);
};

const verifiEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const userToVerify = await userModel.findByVerificationToken(
    verificationToken
  );

  if (!userToVerify) {
    const pathToFile = path.join(__dirname, '../files/error.html');
    return res.status(404).sendFile(pathToFile);
  }

  await userModel.verifyUser(userToVerify._id);

  const pathToFile = path.join(__dirname, '../files/successfully.html');
  return res.status(200).sendFile(pathToFile);
};

const validateSingIn = (req, res, next) => {
  const signInRules = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
    params: Joi.object({
      height: Joi.number().required(),
      age: Joi.number().required(),
      currentWeight: Joi.number().required(),
      desiredWeight: Joi.number().required(),
      bloodGroup: Joi.number().required(),
    }),
  }).required();

  const validationResult = signInRules.validate(req.body);

  if (validationResult.error) {
    next(new ErrorConstructor(400));
  }

  next();
};

const validateCreateUser = (req, res, next) => {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
    params: Joi.object({
      height: Joi.number().required(),
      age: Joi.number().required(),
      currentWeight: Joi.number().required(),
      desiredWeight: Joi.number().required(),
      bloodGroup: Joi.number().required(),
    }),
  }).required();

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    next(new ErrorConstructor(400));
  }

  next();
};

module.exports = {
  signUp,
  signIn,
  logout,
  authorize,
  getCurrentUser,
  updateRefreshToken,
  sendVerificationEmail,
  verifiEmail,
  validateSingIn,
  validateCreateUser,
};
