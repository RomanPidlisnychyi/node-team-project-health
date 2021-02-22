const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    calorie: {
        type: Number,
        required: true
    }
})

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;