import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

const Login = () => {
  const history = useHistory();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      localStorage.setItem('token', response.data.token);
      history.push('/products'); // Redirect to the product page after login
    } catch (error) {
      console.error('Login failed');
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required'),
      })}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
        </div>
        <div>
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
};

export default Login;
