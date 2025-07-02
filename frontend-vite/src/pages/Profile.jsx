import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { backendUrl, token } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', password: '' });
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("🔍 Profile fetch response:", data);

        setUser({ fullName: data.fullName, email: data.email });
        setForm({ fullName: data.fullName, password: '' });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };



    const fetchOrders = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/order/view-orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [backendUrl, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log("🔄 Update response:", data);

      if (!data.updatedUser) {
        throw new Error("User data missing in response");
      }

      alert('Profile updated successfully!');
      setUser({
        fullName: data.updatedUser.fullName,
        email: data.updatedUser.email
      });
      setForm({ fullName: data.updatedUser.fullName, password: '' });
      setEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert("Failed to update profile.");
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("⚠️ This will permanently delete your profile. Continue?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert("Your profile has been deleted.");

      // Optional: log out and redirect
      localStorage.removeItem('token');
      navigate("/login");
    } catch (err) {
      console.error('Failed to delete profile:', err);
      alert('Failed to delete profile');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/order/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert("Order deleted successfully!");

      // Refresh the orders list
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Failed to delete order');
    }
  };


  if (!user) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">👤 Your Profile</h1>

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
          <div className="flex justify-end gap-3">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="mb-6">
          <p className="text-lg"><strong>Name:</strong> {user.fullName}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setEditing(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit Profile</button>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-10 mb-4">🧾 Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Items</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.items.map(i => i.product?.pdtName || 'Deleted').join(', ')}</td>
                <td className="p-2">₹{order.totalAmount}</td>
                <td className="p-2">{order.currentStatus}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
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
      )}
      <button
        onClick={handleDeleteProfile}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Profile
      </button>
    </div>
  );
}
