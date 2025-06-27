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


  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl space mx-auto bg-white shadow-lg rounded-lg p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-center">{product.pdtName}</h2>
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
