const rationModel = require('../models/rationModel');
const userModel = require('../models/userModel');
const ErrorConstructor = require('../errors/ErrorConstructor');

const getRationByData = async (req, res, next) => {
  const { date } = req.params;
  const userId = req.user._id;

  const ration = await rationModel.findOne({
    date,
    userId,
  });

  if (!ration) {
    next(new ErrorConstructor(404));
  }

  return res.status(200).json(ration.rationItems);
};

const updateUserParams = async (req, res, next) => {
  const userId = req.user.id;
  const params = req.body;

  const user = await userModel.findByIdAndUpdate(
    userId,
    { params },
    { new: true }
  );

  res.status(200).json(user.params);
};

module.exports = {
  getRationByData,
  updateUserParams,
};
