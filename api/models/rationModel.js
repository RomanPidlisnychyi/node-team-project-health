const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const rationSchema = new Schema({
    data: {
        type: String,
        required: true
    },
    userId: ObjectId,
    rationItems: [{
        productId: {
            type: ObjectId,
            required: true
        },
        weight: {
            type: Number,
            required: true,
        } 
    }] 
})

const rationModel = mongoose.model('rations', rationSchema);
module.exports = rationModel;