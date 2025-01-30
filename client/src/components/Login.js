import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

const Login = () => {
  const history = useHistory();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      localStorage.setItem('token', response.data.token);
      history.push('/products');
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
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" />
        </div>
        <div>
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" />
        </div>
        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
};

export default Login;
