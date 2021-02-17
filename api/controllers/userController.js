const register = async (req, res, next) =>
  res.status(201).json({ message: `'It's ok!` });

module.exports = {
  register,
};
