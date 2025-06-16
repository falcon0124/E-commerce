const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

async function placeOrder(req, res) {
    const userId = req.user._id;

    try {
        const userCart = await Cart.findOne({ user: userId });

        if (!userCart || userCart.items.length === 0) {
            return res.status(401).json({ message: 'No items in cart' });
        }

        const { paymentMethod, shippingAddress } = req.body;

        let totalAmount = 0;
        let cartSize = userCart.items.length;

        while (cartSize > 0) {
            const currentItem = userCart.items[cartSize - 1];
            const productData = await Product.findById(currentItem.product);

            if (productData) {
                totalAmount += productData.price * currentItem.quantity;
            }

            cartSize--;
        }


        const orderItems = await Order.create({
            user: userId,
            items: userCart.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
            })),
            totalAmount,
            currentStatus: 'PLACED',
            paymentMethod,
            shippingAddress,
        });

        userCart.items = [];
        await userCart.save();

        res.status(200).json({
            message: `Order of amount ₹${totalAmount} placed successfully`,
            order: orderItems,
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Some error occurred' });
    }
}

async function viewUserOrder(req, res) {
    const userId = req.user._id;

    try {
        const userOrder = await Order.find({ user: userId })
            .populate("items.product");

        if (userOrder.length === 0) {
            return res.status(200).json({ message: 'No orders found' });
        }

        return res.status(200).json({ message: `${userOrder.length} order(s) found`, orders: userOrder });

    } catch (err) {
        return res.status(400).json({ message: "something went wrong" });

    }
}

async function deleteOder(req, res) {
    const userId = req.user._id;
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);

        if (!order || order.user.toString() !== userId) {
            return res.status(404).json({ message: 'Order not found or unauthorized' });
        }
        await Order.findByIdAndDelete(orderId);
        return res.status(200).json({ message: 'Order deleted' })
    } catch (err) {
        return res.status(200).json({ message: 'Something went wrong' });

    }
}

async function viewOrdersAdmin(req, res) {
    try {
        const allOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'fullName')
            .populate('items.product');

        if (allOrders.length === 0) {
            return res.status(200).json({ message: 'No orders to show' })
        }

        return res.status(200).json({ message: `${allOrders.length} order(s) found`, allOrders });

    } catch (err) {
        return res.status(400).json({ message: "something went wrong" });

    }
}

async function updateStatus(req, res) {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    try {
        const userOrder = await Order.findById(orderId);

        if (!userOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }


        userOrder.currentStatus = newStatus;
        await userOrder.save();

        return res.status(200).json({ message: `Order status updated to ${newStatus}` });
    } catch (err) {
        return res.status(400).json({ message: 'something went wrong' });
    }
}
module.exports = { placeOrder, viewUserOrder, viewOrdersAdmin, deleteOder, updateStatus };
