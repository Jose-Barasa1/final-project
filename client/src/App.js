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
  const [searchQuery, setSearchQuery] = useState('');  // State to track search query

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

  // Define the handleSearch function
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);  // Update the search query in the state
    console.log("Search Query:", query);
    // You can add filtering logic here based on the search query
  };

  return (
    <Router>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        handleSearch={handleSearch}  // Pass handleSearch as a prop
      />
     <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products searchQuery={searchQuery} />} />
  <Route path="/orders" element={<Orders />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
,/</Router>

  );
}

export default App;

