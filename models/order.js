const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
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
        quantity: {
            type: Number,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    currentStatus: {
        type: String,
        required: true,
        default: 'pending'
    },
    paymentMethod:{
        type: String,
        required: true, 
        enum: ['UPI', 'COD', 'CREDIT', 'DEBIT', 'BITCOIN'], 
        default: 'COD'
    },
    shippingAdaress: {
        type: String,
        required: true,
    },
}, {timestamps: true}); 

const Order = model('order', orderSchema);

module.exports = Order;