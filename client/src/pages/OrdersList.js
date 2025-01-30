import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Orders</h2>
      <div className="list-group">
        {orders.map(order => (
          <div key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Order #{order.id}</h5>
              <p className="mb-1">
                <strong>Status:</strong> {order.status}
              </p>
            </div>
            <div>
              <FontAwesomeIcon
                icon={order.status === 'Delivered' ? faCheckCircle : (order.status === 'In Transit' ? faTruck : faTimesCircle)}
                className={`me-2 ${order.status === 'Delivered' ? 'text-success' : (order.status === 'In Transit' ? 'text-primary' : 'text-danger')}`}
                size="2x"
              />
              <button className="btn btn-info btn-sm">
                <i className="fas fa-eye"></i> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;

