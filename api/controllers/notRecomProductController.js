const productModel = require('../models/productModel');

const getListNotRecomendedProducts = async (req, res) => {
  const { height, age, currentWeight, desiredWeight, bloodGroup } = req.body;

  const dailyCalorieNorm =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight);

  const dailyCalorieNormInteger = Math.round(dailyCalorieNorm);

  const fn = bloodGroup => {
    const groupBloodNotAllowed = `groupBloodNotAllowed.${bloodGroup}`;

    return {
      [groupBloodNotAllowed]: true,
    };
  };

  const listNotRecomendedProducts = await productModel.find(fn(bloodGroup), {
    categories: 1,
  });

  let listNotProducts = listNotRecomendedProducts
    .map(product => product.categories[0])
    .filter((element, index, array) => array.indexOf(element) == index);

  return res.status(200).json({ listNotProducts, dailyCalorieNormInteger });
};

const getListNotRecomendedProductsByCategory = async (req, res, next) => {
  const { category, bloodGroup } = req.params;

  const groupBloodNotAllowed = `groupBloodNotAllowed.${bloodGroup}`;

  const titlesList = await productModel.find(
    {
      $and: [{ [groupBloodNotAllowed]: true }, { 'categories.0': category }],
    },
    { 'title.ru': 1 }
  );

  const filtredTitles = titlesList.map(product => product._doc.title.ru);

  return res.status(200).json(filtredTitles);
};

module.exports = {
  getListNotRecomendedProducts,
  getListNotRecomendedProductsByCategory,
};
