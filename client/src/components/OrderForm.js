import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const OrderForm = () => {
  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5000/order', values);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        product_id: '',
        quantity: 1,
      }}
      validationSchema={Yup.object({
        product_id: Yup.string().required('Product is required'),
        quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
      })}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <Field as="select" name="product_id">
            {/* Here you would dynamically load the product options */}
            <option value="">Select Product</option>
            <option value="1">Product 1</option>
            <option value="2">Product 2</option>
            {/* Add your options dynamically */}
          </Field>
          <ErrorMessage name="product_id" component="div" />
        </div>
        <div>
          <Field type="number" name="quantity" min="1" />
          <ErrorMessage name="quantity" component="div" />
        </div>
        <button type="submit">Place Order</button>
      </Form>
    </Formik>
  );
};

export default OrderForm;
