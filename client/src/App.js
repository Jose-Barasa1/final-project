import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/OrdersList';
import Login from './components/Login';
import Register from './components/Register'; // Add this import
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check if the user is logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Handle the logout action
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsLoggedIn(false); // Update state
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Define the register route */}
      </Routes>
    </Router>
  );
}

export default App;

