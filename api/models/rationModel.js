const mongoose = require("mongoose");
const { Schema } = mongoose;

const rationSchema = new Schema({
  date: { type: String, required: true },
  userId: { type: String, required: true },
  rationItems: [
    {
      productId: { type: String },
      // productId: { type: "ObjectId", ref: "products" },
      weight: { type: Number },
    },
  ],
});

const rationModel = mongoose.model("Ration", rationSchema);

module.exports = rationModel;
