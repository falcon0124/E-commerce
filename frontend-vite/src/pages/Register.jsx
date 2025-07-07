import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../sevices/auth";
import axiosInstance from '../sevices/api/index'
import { useAuth } from "../context/AuthContext";

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();


 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axiosInstance.post('/auth/register', {
      fullName,
      email,
      password,
    });

    console.log('✅ Registration successful:', res.data);

    const { token } = res.data;
    localStorage.setItem('token', token);

    setIsLoggedIn(true);
    navigate('/');
    
  } catch (err) {
    console.error('❌ Registration failed:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Something went wrong');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Register
          </button>
          <p>Allready have an account? <Link to={'/Login'} className="text-blue-300">Sign-in</Link></p>
        </form>
      </div>
    </div>
  );
}
