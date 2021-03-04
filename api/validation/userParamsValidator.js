const Joi = require('joi');
const ErrorConstructor = require('../errors/ErrorConstructor');
const errorsConfig = require('../errors/errorsConfig');

module.exports.validateUserParams = (req, res, next) => {
  const validationRules = Joi.object({
    height: Joi.number().integer().min(90).max(210).positive().required(),
    age: Joi.number().integer().min(5).max(110).positive().required(),
    currentWeight: Joi.number()
      .integer()
      .min(30)
      .max(300)
      .positive()
      .required(),
    desiredWeight: Joi.number()
      .integer()
      .min(30)
      .max(300)
      .positive()
      .required(),
    bloodGroup: Joi.number().integer().min(1).max(4).positive().required(),
  }).required();

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    next(new ErrorConstructor(...errorsConfig(400)));
  }

  next();
};
