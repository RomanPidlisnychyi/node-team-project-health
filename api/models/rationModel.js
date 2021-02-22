const mongoose = require("mongoose");
// const { Schema } = mongoose;
const { Schema, Types: { ObjectId } } = mongoose;

const rationSchema = new Schema({
  date: { type: String, required: true },
  userId: { type: String, required: true },
  rationItems: [
    {
      productId: { type: String },
      weight: { type: Number },
      calories: { type: Number },
    },
  ],
});

const rationModel = mongoose.model("rations", rationSchema);

module.exports = rationModel;
