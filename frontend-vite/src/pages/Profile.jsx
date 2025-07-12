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
  const [allUsers, setAllUsers] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
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
        console.log("Fetched user profile:", data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [backendUrl, token]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const url =
        user.role === 'ADMIN'
          ? `${backendUrl}/api/admin/orders`
          : `${backendUrl}/api/order/view-orders`;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (user.role === 'ADMIN') setAdminOrders(data.allOrders || []);


        else setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/product/my-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllUsers(data.users || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchOrders();
    fetchProducts();
    if (user.role === 'ADMIN') fetchAllUsers();
  }, [backendUrl, token, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

  const handleDeleteProfile = async () => {
    if (!window.confirm("⚠️ This will permanently delete your profile. Continue?")) return;
    try {
      await fetch(`${backendUrl}/api/user/profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Your profile has been deleted.");
      localStorage.removeItem('token');
      navigate("/login");
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setAdminOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: data.updatedOrder.status } : order
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
  try {
    const res = await fetch(`${backendUrl}/api/product/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Delete failed');
    alert('Deleted!');
    setProducts(prev => prev.filter(p => p._id !== productId));
  } catch (err) {
    console.error('❌ Failed to delete product:', err);
    alert('Delete failed');
  }
};


  if (!user) return <div className="text-center py-10">Loading profile...</div>;

  if (user.role === 'ADMIN') {
    return (
      <div className="max-w-6xl space mx-auto p-6 bg-white rounded-lg shadow-lg space-y-10 mb-5">
        <h1 className="text-3xl font-bold text-center">👑 Admin Dashboard</h1>
        <p className="text-lg text-center">Welcome, {user.fullName}</p>

        <button
          onClick={handleLogout}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Logout
        </button>

        <section>
          <h2 className="text-2xl font-bold mb-4">📋 All Users</h2>
          {allUsers.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-gray-100 text-gray-900 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 border-b">Name</th>
                    <th className="px-6 py-3 border-b">Email</th>
                    <th className="px-6 py-3 border-b">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b">{u.fullName}</td>
                      <td className="px-6 py-4 border-b">{u.email}</td>
                      <td className="px-6 py-4 border-b">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded font-semibold ${u.role === 'ADMIN'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>


        <section>
          <h2 className="text-2xl font-bold mb-4">📦 All Orders</h2>
          {adminOrders.length === 0 ? (
            <p className="text-gray-600">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-gray-100 text-gray-900 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 border-b">Order ID</th>
                    <th className="px-6 py-3 border-b">User</th>
                    <th className="px-6 py-3 border-b">Items</th>
                    <th className="px-6 py-3 border-b">Total</th>
                    <th className="px-6 py-3 border-b">Status</th>
                    <th className="px-6 py-3 border-b">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 border-t">
                      <td className="px-6 py-4 border-b">{order._id}</td>
                      <td className="px-6 py-4 border-b">{order.user?.fullName || 'Unknown'}</td>
                      <td className="px-6 py-4 border-b">
                        {order.items.map(i => i.product?.pdtName || 'Deleted').join(', ')}
                      </td>
                      <td className="px-6 py-4 border-b">₹{order.totalAmount}</td>
                      <td className="px-6 py-4 border-b">
                        <span className={`inline-block px-2 py-1 text-xs rounded font-semibold
                  ${order.currentStatus === 'Placed' ? 'bg-yellow-100 text-yellow-800' :
                            order.currentStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.currentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'}`}>
                          {order.currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b">
                        <select
                          value={order.currentStatus}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    );
  }

  return (
    <div className="max-w-6xl space mx-auto p-6 bg-white rounded-lg shadow-lg space-y-10 mb-5">
      <h1 className="text-3xl font-bold text-center">👤 Your Profile</h1>
      <p className="text-center text-lg">Welcome, {user.fullName}</p>
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
                    <td className="p-2">{order.currentStatus}</td>
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
