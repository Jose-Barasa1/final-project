import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-success font-weight-bold">Welcome to Mama Mboga!</h1>
        <p className="lead text-muted">
          A fresh, fast, and reliable grocery delivery service right at your doorstep.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body text-center p-4">
              <h5 className="card-title text-success font-weight-bold">Browse Products</h5>
              <p className="card-text text-muted">Explore a variety of products and add them to your cart.</p>
              <Link to="/products" className="btn btn-success btn-lg px-4 py-2 rounded-pill">
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body text-center p-4">
              <h5 className="card-title text-primary font-weight-bold">Track Your Delivery</h5>
              <p className="card-text text-muted">Track your orders and see real-time updates on deliveries.</p>
              <Link to="/orders" className="btn btn-primary btn-lg px-4 py-2 rounded-pill">
                Track Delivery
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        {!isLoggedIn ? (
          <>
            <h3 className="font-weight-bold mb-3 text-info">Join Us Today!</h3>
            <Link to="/login" className="btn btn-info btn-lg px-4 py-2 rounded-pill">
              Login / Register
            </Link>
          </>
        ) : (
          <>
            <h3 className="font-weight-bold mb-3 text-success">Welcome Back!</h3>
            <button className="btn btn-danger btn-lg px-4 py-2 rounded-pill" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
