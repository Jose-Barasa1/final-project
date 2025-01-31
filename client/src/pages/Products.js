import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
        toast.error('Failed to fetch products!');
      });
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/products/${productId}`)
        .then(() => {
          setProducts(products.filter(product => product.id !== productId));
          toast.success('Product deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          toast.error('Failed to delete product.');
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Products</h2>
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <Draggable>
                <div className="card shadow-lg">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text"><strong>KSh {product.price}</strong></p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-success btn-sm">
                        <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                      </button>
                      <Link to={`/product/${product.id}`} className="btn btn-primary btn-sm">
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Draggable>
            </div>
          ))
        ) : (
          <p>No products found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
