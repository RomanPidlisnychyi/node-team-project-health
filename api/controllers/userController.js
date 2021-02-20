const productModel = require('../models/productModel');
const rationModel = require('../models/rationModel');
const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;
const validator = require('../validation/validator');
const idSchema = require('../validation/idSchema');

// const register = async (req, res, next) =>
//   res.status(201).json({ message: `'It's ok!` });

const getProducts = async (req, res, next) => {
  const findedProducts = [];

  for (const [key, value] of Object.entries(req.query)) {
    const products = await productModel.find({ name: key.toLowerCase() });

    if (products.length > 0) {
      findedProducts.push(...products);
    }
  }

  return findedProducts.length > 0
    ? res.status(201).send(findedProducts)
    : res.status(404).send({ message: "Not found" });
}

const pushRationByData = async (req, res, next) => {
  const ress = await rationModel.create({
    data: Date.now(),
    userId: ObjectId('602ed4e5c0d9f92f80ddb778'),
    rationItems: [{
      productId: ObjectId('602ed4962fbace1378a7b1e8'),
      weight: 1200
    }]
  })
  if (ress) {
    console.log('ress: ', ress);
    res.status(201).send(ress);
  }
}

const pushRationByData2 = async (req, res, next) => {
  const body = {
    data: Date.now(),
    userId: '602ed4e5c0d9f92f80ddb778'
  }

  const item = {
    productId: '602ed4962fbace1378a7b1e8',
    weight: 200
  }

  const resObject = {
    // data: body.data,
    // userId: ObjectId(body.userId),
    rationItems: [
      {
        productId: ObjectId(item.productId),
        weight: item.weight
      }
    ]
  }

  const ress = await rationModel.updateOne(
    { _id: ObjectId('60302ccf06563221d8713c7c') },
    { $addToSet: resObject }
  )
  if (ress) {
    console.log('ress: ', ress);
    res.status(201).send(ress);
  }
}

const getRationByData = async (req, res, next) => {
  const { data, userId } = req.body;
  if (!data || !userId) {
    return res.status(400).send({ message: 'request is not complette' });
  }

  const validate = await validator({ id: userId }, idSchema);
  if (validate) {
    return res.status(400).send({ message: 'Incorrect id.' });
  }

  const ress = await rationModel.find({
    data,
    userId
  })

  if (ress.length === 0) {
    return res.status(404).send({ message: 'Not found' });
  }

  if (ress) {
    // console.log('ress: ', ress);
    res.status(201).send(ress);
  }
}

module.exports = {
  // register,
  getProducts,
  getRationByData,
  pushRationByData,
  pushRationByData2
};
