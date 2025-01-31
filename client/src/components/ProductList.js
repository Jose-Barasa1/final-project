import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { Button, Card, Row, Col } from 'react-bootstrap'; // Import Bootstrap components for layout

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
    return <div className="alert alert-danger text-center">{error}</div>;  // Show error message if fetching fails
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>
      
      {/* Check if products are available */}
      {products.length === 0 ? (
        <div className="alert alert-info text-center">No products available.</div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={product.image || "https://via.placeholder.com/300"} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    KSh {product.price}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    {/* Edit and Delete buttons with icons */}
                    <Button variant="warning" size="sm">
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      <i className="fas fa-trash"></i> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;
