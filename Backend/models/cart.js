const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true,
        },
        quantity:{
            type: Number,
            required: true,
        }
    }]
});

const Cart = model('cart', cartSchema);

module.exports = Cart;