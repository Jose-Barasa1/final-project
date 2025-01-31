import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage

  useEffect(() => {
    if (!token) {
      setError('Please log in to view your orders.');
      setLoading(false);
      navigate('/login'); // Redirect to login page if token doesn't exist
      return;
    }

    axios
      .get('http://localhost:5000/orders', {
        headers: { Authorization: `Bearer ${token}` }, // Add token to the request headers
      })
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          navigate('/login');  // Redirect to login if token is invalid
        } else if (error.response && error.response.status === 403) {
          setError('Forbidden access. You do not have permission to view these orders.');
        } else {
          setError('Failed to fetch orders. Please try again later.');
        }
        setLoading(false);
      });
  }, [token, navigate]);

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Orders</h2>
      <div className="list-group">
        {orders.length === 0 ? (
          <div className="alert alert-info text-center">You have no orders yet.</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 className="mb-1">Order #{order.id}</h5>
                <p className="mb-1">
                  <strong>Status:</strong> {order.status}
                </p>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={
                    order.status === 'Delivered'
                      ? faCheckCircle
                      : order.status === 'In Transit'
                      ? faTruck
                      : faTimesCircle
                  }
                  className={`me-2 ${
                    order.status === 'Delivered'
                      ? 'text-success'
                      : order.status === 'In Transit'
                      ? 'text-primary'
                      : 'text-danger'
                  }`}
                  size="2x"
                />
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleViewDetails(order.id)}
                >
                  <i className="fas fa-eye"></i> View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersList;

