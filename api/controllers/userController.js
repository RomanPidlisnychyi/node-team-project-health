const productModel = require('../models/productModel');
const rationModel = require('../models/rationModel');
const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;
const validator = require('../validation/validator');
const idSchema = require('../validation/idSchema');
const products = require('../helpers/products.json');
const userModel = require("../models/userModel");
const { prepareUsersResponse } = require("../helpers/prepareUserResponse");

const getProducts = async (req, res, next) => {
  const findedProducts = [];

  for (const [key, value] of Object.entries(req.query)) {

    // const products = await productModel.find({$or:[ { "title.ru": key }, {"title.ua": key}]});
    // const products = await productModel.find({ $text: { $search: key } });
    // const products = await productModel.find({"title.ru": {$regex: key}});

    const pattern = new RegExp(key, "i");
    const products = await productModel.find({"title.ru": pattern});    

    if (products.length > 0) {
      findedProducts.push(...products);
    }
  }

  return findedProducts.length > 0
    ? res.status(201).send(findedProducts)
    : res.status(404).send({ message: "Not found" });
};

const getAllTitles = async (req, res, next) => {
  const titles = await productModel.find({});
  if (!titles) {
    return res.status(404).send({message: 'Not found'});
  }

  const filteredTitles = titles.map(el => el._doc.title)
  return res.status(201).send(filteredTitles);
}

const pushProductsToDB = async (req, res, next) => {
  const productsFiltered = [];

  const tt = products.map(item => {
    const tmpObj = {};
    for (const [key, value] of Object.entries(item)) {
      if (key !== '_id') {
        tmpObj[key] = value;
      } 
    }
    productsFiltered.push(tmpObj);
  })

  const ress = await productModel.insertMany(productsFiltered);

  if (ress) {
    res.status(201).send({message: ' ok'});
  }
}

const pushRationByData = async (req, res, next) => {
  const ress = await rationModel.create({
    data: Date.now(),
    userId: ObjectId("602ed4e5c0d9f92f80ddb778"),
    rationItems: [
      {
        productId: ObjectId("602ed4962fbace1378a7b1e8"),
        weight: 1200,
      },
    ],
  });
  if (ress) {
    console.log("ress: ", ress);
    res.status(201).send(ress);
  }
};

const pushRationByData2 = async (req, res, next) => {
  const body = {
    data: Date.now(),
    userId: "602ed4e5c0d9f92f80ddb778",
  };

  const item = {
    productId: "602ed4962fbace1378a7b1e8",
    weight: 200,
  };

  const resObject = {
    rationItems: [
      {
        productId: ObjectId(item.productId),
        weight: item.weight,
      },
    ],
  };

  const ress = await rationModel.updateOne(
    { _id: ObjectId("60302ccf06563221d8713c7c") },
    { $addToSet: resObject }
  );
  if (ress) {
    console.log("ress: ", ress);
    res.status(201).send(ress);
  }
};

const getRationByData = async (req, res, next) => {
const { date, userId } = req.body;
  if (!date || !userId) {
    return res.status(400).send({ message: 'request is not complette' });
  }

  const validate = await validator({ id: userId }, idSchema);
  if (validate) {
    return res.status(400).send({ message: "Incorrect id." });
  }

  const ress = await rationModel.find({
    date,
    userId
  })

  if (ress.length === 0) {
    return res.status(404).send({ message: "Not found" });
  }

  if (ress) {
    res.status(201).send(ress);
  }
};

getCurrentUser = async (req, res) => {
  const [userForResponse] = await prepareUsersResponse([req.user]);

  return res.status(200).send(userForResponse);
};

const updateUserParams = async (req, res) => {
  const userId = req.user.id;

  const { height, age, currentWeight, desiredWeight } = req.body;

  const paramsToUpdate = await userModel.findByIdAndUpdateUserParams(
    userId,
    req.body
  );

  if (!paramsToUpdate) {
    return res.status(404).send({ message: "User not authorized!" });
  }

  const dailyCalorieNorm =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight);

  res.status(200).send({
    message: `Your recommended daily calorie norm: ${dailyCalorieNorm} cal.`,
  });
};

module.exports = {
  getProducts,
  getRationByData,
  pushRationByData,
  pushRationByData2,
  pushProductsToDB,
  getAllTitles,
  getCurrentUser,
  updateUserParams,
};
