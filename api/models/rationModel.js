const mongoose = require("mongoose");
const { Schema } = mongoose;

const rationSchema = new Schema({
  date: { type: String, required: true },
  userId: { type: String, required: true },
  rationItems: [
    {
      // product: { type: "ObjectId", ref: "products", required: true },
      product: { type: String },
      weight: { type: Number },
    },
  ],
});

const rationModel = mongoose.model("Ration", rationSchema);

module.exports = rationModel;
