const Joi = require('joi');

module.exports.validateUserParams = (req, res, next) => {
  const validationRules = Joi.object({
    growth: Joi.number().integer().min(90).max(210).positive().required(),
    age: Joi.number().integer().min(5).max(110).positive().required(),
    currentWeight: Joi.number().integer().min(30).max(300).positive().required(),
    desiredWeight: Joi.number().integer().min(30).max(300).positive().required(),
    bloodGroup: Joi.number().integer().min(1).max(4).positive().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};
