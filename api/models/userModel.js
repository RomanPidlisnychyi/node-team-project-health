const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  params: {
    height: { type: String, require: true },
    age: { type: String, require: true },
    weight: { type: String, require: true },
    desiredWeight: { type: String, require: true },
    bloodType: { type: String, require: true },
  },
  verificationToken: String,
  token: String,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
