const productModel = require('../models/productModel');
const ErrorConstructor = require('../errors/ErrorConstructor');

const getProductsByQuery = async (req, res, next) => {
  const findedProducts = [];

  for (const [key, value] of Object.entries(req.query)) {
    const pattern = new RegExp(key, 'i');
    const products = await productModel.find(
      { 'title.ru': pattern },
      { 'title.ru': 1 }
    );

    if (products.length > 0) {
      findedProducts.push(...products);
    }
  }

  const filtredTitles = findedProducts.map(product => product._doc.title.ru);

  return findedProducts.length > 0
    ? res.status(201).json(filtredTitles)
    : next(new ErrorConstructor(404));
};

const getTitlesByLang = async (req, res, next) => {
  const { lg } = req.query;
  const language = lg ? lg : 'ru';

  const key = `title.${language}`;

  const titles = await productModel.find(
    {},
    {
      [key]: 1,
    }
  );
  if (!titles) {
    next(new ErrorConstructor(404));
  }

  const filteredTitles = titles.map(el => el._doc.title[language]);

  return res.status(201).json(filteredTitles);
};

module.exports = {
  getProductsByQuery,
  getTitlesByLang,
};
