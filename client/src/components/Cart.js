import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    axios
      .get('http://localhost:5000/cart', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setCartItems(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to load cart items.');
      });
  }, [navigate]);

  const handlePlaceOrder = () => {
    const token = localStorage.getItem('token');
    const cartItemsData = cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity }));
    axios
      .post('http://localhost:5000/order', { cart_items: cartItemsData }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => navigate('/orders'))
      .catch(() => setError('Failed to place order.'));
  };

  const calculateTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <span>{item.product_name}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Price: KSh {item.price}</span>
              </li>
            ))}
          </ul>
          <h3>Total: KSh {calculateTotalPrice()}</h3>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </>
      )}
    </div>
  );
};

export default Cart;
