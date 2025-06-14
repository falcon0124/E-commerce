const Cart = require('../models/cart');

async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        const newItem = {
                user: userId,
                items: [{ product: productId, quantity: Number(quantity) }],
            }
        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            const cartItems = await Cart.create(newItem)
            return res.status(200).json({ message: 'Item added to cart', cartItems });
        } else {
            const existingItem = userCart.items.find(item => item.product.toString() === productId);
            if (existingItem) {
               existingItem.quantity += Number(quantity);
            }else{
                userCart.items.push({ product: productId, quantity: Number(quantity) });
            }
            await userCart.save()
        }
        res.status(200).json({ message: 'Cart updated', cart: userCart });

    } catch (err) {
        res.status(400).json({ message: 'Something went wrong' })
    }
}

module.exports = addToCart;