import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);  // Handle error state
  const token = localStorage.getItem('token');  // Ensure JWT token is retrieved

  useEffect(() => {
    if (token) {  // Check if user is logged in and token exists
      axios
        .get('http://localhost:5000/products', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProducts(response.data); // Set products state
        })
        .catch((error) => {
          setError('Failed to fetch products');
          console.error('Error fetching products:', error);
        });
    } else {
      setError('Please log in to view products.');
    }
  }, [token]);

  if (error) {
    return <div>{error}</div>;  // Show error message if fetching fails
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>
      <div className="list-group">
        {products.map((product) => (
          <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{product.name}</h5>
              <p className="mb-1">KSh {product.price}</p>
            </div>
            <div>
              {/* Edit and Delete buttons with icons */}
              <button className="btn btn-warning btn-sm me-2">
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-danger btn-sm">
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
