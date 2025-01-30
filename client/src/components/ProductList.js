import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>
      <div className="list-group">
        {products.map(product => (
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
