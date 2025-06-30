import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { backendUrl, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/cart/view`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(`HTTP ${res.status} - ${errMsg}`);
        }

        const data = await res.json();
        console.log("🛒 Cart data:", data);

        setCartItems(data.cart?.items || []);
      } catch (err) {
        console.error("❌ Failed to load cart:", err);
      }
    };

    if (token) fetchCart();
  }, [backendUrl, token]);


  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
      }
    } catch (err) {
      console.error("❌ Remove failed:", err);
    }
  };

  const totalPrice = (cartItems || []).reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  const handleCheckout = async () => {

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/PlaceOrder", {
      state: { cartItems, totalPrice }
    })
  };


  return (
    <div className="max-w-4xl space mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map(({ product, quantity }) => (
            <div key={product._id} className="flex items-center justify-between border-b pb-4">
              <img src={`${backendUrl}/${product.imageUrl}`} alt={product.pdtName} className="w-24 h-24 object-contain rounded" />
              <div className="flex-1 px-4">
                <h3 className="text-lg font-semibold">{product.pdtName}</h3>
                <p className="text-gray-600">₹{product.price} × {quantity}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 font-semibold"
                onClick={() => handleRemove(product._id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right text-xl font-bold">
            Total: ₹{totalPrice}
          </div>
          <button className="bg-blue-700 p-5 rounded-2xl font-bold text-amber-100 hover:bg-blue-600"
            onClick={handleCheckout}
          >
            CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
}
