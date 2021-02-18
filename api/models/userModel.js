const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  params: { type: 'ObjectId', ref: 'Product' },
  rations: [{ type: 'ObjectId', ref: 'Ration' }],
  verificationToken: String,
  token: String,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
