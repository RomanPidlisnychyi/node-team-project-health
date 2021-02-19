const notRecomProductModel = require("../models/notRecomProductModel");

const getListNotRecomendedProducts = async (req, res) => {

  const listNotRecomendedProducts = await notRecomProductModel.find();
  console.log("listNotRecomendedProducts:", listNotRecomendedProducts);

  return res.status(200).send(listNotRecomendedProducts);
//   return res.send(listNotRecomendedProducts);
};

module.exports = {
  getListNotRecomendedProducts,
};
