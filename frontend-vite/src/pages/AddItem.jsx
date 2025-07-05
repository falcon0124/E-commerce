import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddItem() {
  const { backendUrl, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pdtName: '',
    pdtDescription: '',
    price: '',
    category: '',
    image: null
  });

  const categories = ['Electronics', 'Books', 'Fashion', 'Home', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdtName', form.pdtName);
    formData.append('pdtDescription', form.pdtDescription);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('image', form.image);

    try {
      const res = await fetch(`${backendUrl}/api/product/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      alert('Product added!');
      navigate('/profile');
    } catch (err) {
      console.error('Failed to add item:', err);
      alert('Failed to add item');
    }
  };

  return (
    <div className="max-w-xl space mx-auto  bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">📤 Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Product Name</label>
          <input
            type="text"
            value={form.pdtName}
            onChange={(e) => setForm({ ...form, pdtName: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Description</label>
          <textarea
            value={form.pdtDescription}
            onChange={(e) => setForm({ ...form, pdtDescription: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Price (₹)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
