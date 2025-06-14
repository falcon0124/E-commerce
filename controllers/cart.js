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
            } else {
                userCart.items.push({ product: productId, quantity: Number(quantity) });
            }
            await userCart.save()
        }
        res.status(200).json({ message: 'Cart updated', cart: userCart });

    } catch (err) {
        res.status(400).json({ message: 'Something went wrong' })
    }
}

async function viewCart(req, res) {
    const userId = req.user._id;
    try {
        const userCart = await Cart.findOne({ user: userId })
            .populate('items.product');
        
        if(!userCart || userCart.items.length === 0){
            return res.status(200).json({ message: 'Cart empty'});
        }
        return res.status(200).json({ message: `${userCart.items.length} found in cart`, cart: userCart });
    } catch(err){
        return res.status(400).json({ message: 'Error fetching cart' });
    }
}

async function deleteItem(req, res) {
    const {productId} = req.params;
    const userId = req.user._id;

    try{
        const userCart = await Cart.findOne({user: userId});
        
        const index = userCart.items.findIndex(item => item.product.toString() === productId);

        if(index === -1){
            return res.status(200).json({message: 'item not in cart'});
        }

        userCart.items.splice(index, 1);
        await userCart.save()

        return res.status(200).json({message: 'Item removed', cart : userCart});
    }catch(err){
        return res.status(400).json({message: 'An error occured'});
    }
}

async function clearCart(req, res) {
    const userId = req.user._id;
    try{
        const userCart = await Cart.findOne({ user: userId });
    
        if(!userCart){
            return res.status(200).json({message: 'cart does not exist'});
        } 
        
        userCart.items = [];
        await userCart.save();

        return res.status(200).json({message: 'Cart emptied', cart: userCart});
    }catch(err){
        
        return res.status(400).json({message: 'an error occured'});
    }
}
module.exports = {addToCart, viewCart, deleteItem, clearCart};