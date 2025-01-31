import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaBox, FaList, FaSignInAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; // FontAwesome icons

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-shopping-cart"></i> Mama Mboga Delivery
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FaHome size={20} className="mr-2" /> {/* Home Icon */}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <FaBox size={20} className="mr-2" /> {/* Products Icon */}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                <FaList size={20} className="mr-2" /> {/* Orders Icon */}
              </Link>
            </li>

            {/* Conditional Rendering: Show login/register or user-related options */}
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt size={20} className="mr-2" /> {/* Login Icon */}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <FaUserCircle size={20} className="mr-2" /> {/* Profile Icon */}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn nav-link text-danger" onClick={handleLogout}>
                    <FaSignOutAlt size={20} className="mr-2" /> {/* Logout Icon */}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
