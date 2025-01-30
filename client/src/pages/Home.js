import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Welcome to the Mama Mboga Delivery System!</h1>
      <p className="lead mb-4">
        Your one-stop solution for all your grocery needs, delivered right to your door!
      </p>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mb-4 shadow-lg">
            <div className="card-body text-center">
              <i className="fas fa-store-alt fa-3x mb-3"></i>
              <h5 className="card-title">Browse Products</h5>
              <p className="card-text">Explore a variety of products and add them to your cart.</p>
              <Link to="/products" className="btn btn-primary">
                <i className="fas fa-shopping-cart"></i> Shop Now
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4 shadow-lg">
            <div className="card-body text-center">
              <i className="fas fa-truck fa-3x mb-3"></i>
              <h5 className="card-title">Track Your Delivery</h5>
              <p className="card-text">See the status of your orders as they are delivered to you.</p>
              <Link to="/orders" className="btn btn-success">
                <i className="fas fa-map-marker-alt"></i> Track Delivery
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-3">Join Us Now!</h3>
        <Link to="/login" className="btn btn-info btn-lg">
          <i className="fas fa-user-circle"></i> Login / Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
