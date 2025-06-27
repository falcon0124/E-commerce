import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { backendUrl } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/product/${id}`);
        const data = await res.json();

        if (!data.product) {
          console.error("❌ Product not found");
          setProduct(null);
          return;
        }

        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProduct();
  }, [backendUrl, id]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${backendUrl}/api/cart/add-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Product added to cart!");
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("❌ Error adding to cart");
    }
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl space mx-auto bg-white shadow-lg rounded-lg p-6 mb-10">
      <div className='flex items-center justify-between mb-4'>
        <h2 className="text-2xl font-bold mb-4 text-center">{product.pdtName}</h2>
        <button className="text-blue-600 hover:text-blue-800 transition" onClick={() => handleAddToCart(product._id)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-7 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.5 6M7 13l-1.5 6h13a1 1 0 001-1V14M10 21a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      <img
        src={`${backendUrl}/${product.imageUrl}`}
        alt={product.pdtName}
        className="w-full h-96 object-contain rounded-lg mb-6"
      />

      <table className="w-full text-left table-auto border-collapse">
        <tbody>
          <tr className="border-b">
            <th className="py-2 px-4">Category</th>
            <td className="py-2 px-4">{product.category}</td>
          </tr>
          <tr className="border-b">
            <th className="py-2 px-4">Price</th>
            <td className="py-2 px-4">{product.price}</td>
          </tr>
          <tr className="border-b">
            <th className="py-2 px-4">Description</th>
            <td className="py-2 px-4">{product.pdtDescription}</td>
          </tr>
          <tr>
            <th className="py-2 px-4">Created By</th>
            <td className="py-2 px-4">
              {product.createdBy?.fullName} <br />
              <span className="text-sm text-gray-500">{product.createdBy?.email}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
