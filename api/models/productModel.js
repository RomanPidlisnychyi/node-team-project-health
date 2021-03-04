const mongoose = require('mongoose');
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const productSchema = new Schema({
  _id: ObjectId,
  categories: [String],
  weight: { type: Number, required: true },
  title: { String },
  calories: {
    type: Number,
  },
  groupBloodNotAllowed: [Boolean],
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;
