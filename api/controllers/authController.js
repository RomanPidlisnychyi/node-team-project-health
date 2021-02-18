// const userModel = require('../models/userModel');

const logout = async (req, res) => {
  // const { token } = req.user;

  // await userModel.findOneAndUpdate(
  //   { token },
  //   {
  //     $unset: { token },
  //   }
  // );

  return res.status(201).json({ message: 'User was successfully logout' });
};

module.exports = {
  logout,
};
