const mongoose = require('mongoose');
const { Schema } = mongoose;

const rationSchema = new Schema({
  date: { type: String, required: true },
  userId: { type: String, required: true },
  rationItems: [
    {
      title: { type: String },
      weight: { type: Number },
      calories: { type: Number },
      groupBloodNotAllowed: [Boolean],
    },
  ],
});

const rationModel = mongoose.model('rations', rationSchema);

module.exports = rationModel;
