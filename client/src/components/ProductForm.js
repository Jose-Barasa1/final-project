import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const ProductForm = ({ product }) => {
  // Handle submit (add or update product)
  const handleSubmit = async (values) => {
    try {
      if (product) {
        // Update product
        await axios.put(`http://localhost:5000/products/${product.id}`, values);
      } else {
        // Add new product
        await axios.post('http://localhost:5000/products', values);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
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
        <div>
          <Field type="text" name="name" placeholder="Product Name" />
          <ErrorMessage name="name" component="div" />
        </div>
        <div>
          <Field type="text" name="description" placeholder="Description" />
          <ErrorMessage name="description" component="div" />
        </div>
        <div>
          <Field type="number" name="price" placeholder="Price" />
          <ErrorMessage name="price" component="div" />
        </div>
        <button type="submit">{product ? 'Update' : 'Add'} Product</button>
      </Form>
    </Formik>
  );
};

export default ProductForm;
