import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Checkout = () => {
  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to checkout');
      return;
    }

    axios
      .post('http://localhost:5000/checkout', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message || 'Checkout successful. Delivery started.');
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Checkout failed';
        toast.error(message);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <button className="btn btn-primary" onClick={handleCheckout}>
        Checkout Orders
      </button>
    </div>
  );
};

export default Checkout;

