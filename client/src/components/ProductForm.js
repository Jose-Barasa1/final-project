import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported

const ProductForm = ({ product }) => {
  // Handle submit (add or update product)
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
    </div>
  );
};

export default ProductForm;
