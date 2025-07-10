import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import PlaceOrder from './pages/PlaceOrder';
import AddItem from './pages/AddItem';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<Cart />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="AddItem" element={<AddItem />} />
        <Route path="placeOrder" element={<PlaceOrder />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>

    </Routes>
  );
}

export default App;
