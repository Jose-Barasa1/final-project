import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/OrdersList';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token') ? true : false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const addToCart = (product) => setCartItems(prev => [...prev, product]);
  const removeFromCart = (productId) => setCartItems(prev => prev.filter(item => item.id !== productId));

  return (
    <Router>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        handleSearch={handleSearch} 
        cartItemCount={cartItems.length} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products searchQuery={searchQuery} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
