const { array } = require('joi');
const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const productSchema = new Schema({
    _id: ObjectId,
    categories: [
        String
    ],
    weight: { type: Number, required: true },
    // others : Schema.Types.Mixed,
    title: {
        type: Map,
        of: String,
    },
    calories: {
        type: Number,
    },
    groupBloodNotAllowed: [Boolean],    
})

productSchema.index({"title.ru": 'text'},  { language: "russian" });
// productSchema.index({"title.ua": 'text'},  { language: "ukrainian" });

const productModel = mongoose.model('products', productSchema);
productModel.createIndexes();
module.exports = productModel;