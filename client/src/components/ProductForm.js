import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const ProductForm = ({ product }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Handle product submission (add or update)
  const handleSubmit = async (values) => {
    try {
      if (product) {
        // Update product
        await axios.put(`http://localhost:5000/products/${product.id}`, values);
        alert('Product updated successfully!');
      } else {
        // Add new product
        await axios.post('http://localhost:5000/products', values);
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('There was an error saving the product. Please try again.');
    }
  };

  // Handle placing an order for a product
  const handleOrder = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to place an order!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/order', { product_id: productId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>
                <i className="fas fa-box"></i> {product ? 'Update' : 'Add'} Product
              </h3>
            </div>
            <div className="card-body">
              <Formik
                initialValues={{
                  name: product ? product.name : '',
                  description: product ? product.description : '',
                  price: product ? product.price : '',
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required('Name is required'),
                  price: Yup.number().required('Price is required').positive('Price must be positive'),
                })}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Product Name</label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                      placeholder="Enter product name"
                    />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <Field
                      type="text"
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="Enter product description"
                    />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <Field
                      type="number"
                      name="price"
                      id="price"
                      className="form-control"
                      placeholder="Enter product price"
                    />
                    <ErrorMessage name="price" component="div" className="text-danger" />
                  </div>

                  <button type="submit" className="btn btn-success w-100 mt-3">
                    <i className="fas fa-save"></i> {product ? 'Update' : 'Add'} Product
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Displaying the list of fetched products for placing an order */}
      <div className="mt-5">
        <h4 className="text-center">Available Products</h4>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {products.map((prod) => (
              <div key={prod.id} className="col-md-4 mb-4">
                <div className="card shadow-lg">
                  <img
                    src="https://via.placeholder.com/150"
                    alt={prod.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{prod.name}</h5>
                    <p className="card-text">{prod.description}</p>
                    <p className="card-text"><strong>KSh {prod.price}</strong></p>
                    <button className="btn btn-success btn-sm w-100" onClick={() => handleOrder(prod.id)}>
                      <i className="fas fa-cart-plus"></i> Place Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
