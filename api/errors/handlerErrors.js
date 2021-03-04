const errorsConfig = require('./errorsConfig');
const handlerErrors = (err, req, res, next) => {
  const { status } = err;

  if (status) {
    return res.status(status).json({ message: errorsConfig(status) });
  }

  return res.status(400).json(err);
};

module.exports = handlerErrors;
