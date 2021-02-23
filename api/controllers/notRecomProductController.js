const notRecomProductModel = require("../models/notRecomProductModel");

const getListNotRecomendedProducts = async (req, res) => {
  const { height, age, currentWeight, desiredWeight, bloodGroup } = req.body;

  const dailyCalorieNorm =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight);

 const dailyCalorieNormInteger = Math.round(dailyCalorieNorm);

  const fn = (bloodGroup) => {
    const groupBloodNotAllowed = `groupBloodNotAllowed.${bloodGroup}`;

    return {
      [groupBloodNotAllowed]: true,
    };
  };

  const listNotRecomendedProducts = await notRecomProductModel.find(
    fn(bloodGroup),
    {
      weight: 0,
      _id: 0,
      calories: 0,
      title: 0,
      __v: 0,
      groupBloodNotAllowed: 0,
    }
  );

  let listNotProducts = listNotRecomendedProducts
    .map((product) => product.categories[0])
    .filter((element, index, array) => array.indexOf(element) == index);

  return res.status(200).json({ listNotProducts, dailyCalorieNormInteger });
};

module.exports = {
  getListNotRecomendedProducts,
};
