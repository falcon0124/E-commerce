import React, { useEffect, useMemo, useState } from 'react';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


const PlaceOrder = () => {
  const minutes = 30;
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const { backendUrl, token } = useAuth();


  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state]);
  const totalPrice = useMemo(() => location.state?.totalPrice || 0, [location.state]);

  useEffect(() => {
    console.log("🛒 Cart items updated:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/Cart");
          alert("⏰ Time's up! Redirecting to cart.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (!location.state) {
      navigate("/cart");
    }
  }, [location.state, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const placingOrder = async (e) => {
    e.preventDefault();

    try {
      const paymentMethod = e.target.paymentMethod.value;
      const shippingAddress = e.target.shippingAddress.value;
      const res = await fetch(`${backendUrl}/api/order`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
        })
      });

      
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(`HTTP ${res.status} - ${errMsg}`);
      }
      
      const data = await res.json();
      alert("order placed");
      navigate('/');
      console.log("✅ Order placed successfully:", data);
    } catch (err) {
      console.error("❌ Order placement failed:", err);
      alert("Failed to place order. Please try again.");
      navigate('/cart');
    }
  }

  return (
    <div className='max-w-4xl space mx-auto bg-white p-6 shadow-lg rounded-lg'>
      <h1 className='text-center font-bold text-4xl mb-4'>Finish Your Order</h1>
      <div className="flex justify-between items-center mb-4 p-3 bg-amber-200 rounded-lg shadow font-semibold text-gray-700 text-lg">
        <span>⏳ Time Left:</span>
        <span className="text-red-600 font-bold tracking-wider text-xl">
          {formatTime(timeLeft)}
        </span>
      </div>
      <h2 className='text-center mx-auto max-w-3xl bg-gray-100 rounded-2xl p-2 font-bold'>Your total amout: <span className='text-violet-900 font-extrabold'>{totalPrice}</span></h2>
      <form onSubmit={placingOrder} className='space-y-4'>
        <div className='space-y-2'>
          <label className='block text-gray-700 font-semibold'>Payment Method</label>
          <select name="paymentMethod" className='w-full p-2 border border-gray-300 rounded'>
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="CREDIT">Credit Card</option>
            <option value="BITCOIN">Bitcoin</option>
          </select>
        </div>

        <div className='space-y-2'>
          <label className='block text-gray-700 font-semibold'>Shipping Address</label>
          <textarea name="shippingAddress" rows="3" className='w-full p-2 border border-gray-300 rounded' required></textarea>
        </div>

        <button type="submit" className='bg-blue-700 p-5 rounded-2xl font-bold text-amber-100 hover:bg-blue-600 w-full'>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
