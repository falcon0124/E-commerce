import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const { backendUrl, token } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/order/view-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/product/my-products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProfile();
    fetchOrders();
    fetchProducts();
  }, [backendUrl, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert('Profile updated successfully!');
      setUser(data.updatedUser);
      setEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await fetch(`${backendUrl}/api/order/delete/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Order deleted successfully!");
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Failed to delete order');
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("⚠️ This will permanently delete your profile. Continue?")) return;

    try {
      await fetch(`${backendUrl}/api/user/profile`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Your profile has been deleted.");
      localStorage.removeItem('token');
      navigate("/login");
    } catch (err) {
      console.error('Failed to delete profile:', err);
      alert('Failed to delete profile');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`${backendUrl}/api/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product deleted successfully!");
      setProducts(prev => prev.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  if (!user) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 space p-6 bg-white rounded-lg shadow-lg mb-5">
      <h1 className="text-3xl font-bold text-center">👤 Your Profile</h1>

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="mb-6">
          <p className="text-lg"><strong>Name:</strong> {user.fullName}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit Profile</button>
            <button onClick={handleDeleteProfile} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Profile</button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex mt-2"
          >
            Logout
          </button>

        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{order._id}</td>
                    <td className="p-2">{order.items.map(i => i.product?.pdtName || 'Deleted').join(', ')}</td>
                    <td className="p-2">₹{order.totalAmount}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">🛍️ Your Products</h2>
        {Array.isArray(products) && products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border p-4 rounded shadow relative">
                <img
                  src={`${backendUrl}/${product.imageUrl}`}
                  alt={product.pdtName}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-semibold">{product.pdtName}</h3>
                <p className="text-gray-600 text-sm">₹{product.price}</p>
                <p className="text-gray-500 text-xs mt-1">{product.category}</p>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-right">
          <Link
            to="/AddItem"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Item
          </Link>
        </div>
      </div>
    </div>
  );
}
