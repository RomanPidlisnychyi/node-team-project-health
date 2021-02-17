module.exports.asyncWrapper = callback => {
  console.log('1');
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
};
