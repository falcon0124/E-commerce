const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    pdtName: {
        type: String,
        required: true,
    },
    pdtDescription:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    imageUrl:{
        type: String,
        required: true,
    }
}, {timestamps: true});

const Product = model("product", productSchema)

module.exports = Product;