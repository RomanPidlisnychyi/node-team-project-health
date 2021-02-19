const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authorized = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.replace('Bearer ', '');

  const user = await userModel.findOne({ token });

  if (!user) {
    return res.status(401).json({ message: 'User does not authorized!' });
  }

  req = {
    ...req,
    user,
    token,
  };

  next();
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await userModel.findOneByIdAndUpdate(_id, {
    $unset: { token },
  });

  return res.status(204).send();
};

module.exports = {
  logout,
  authorized,
};
