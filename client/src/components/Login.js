import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for React Router v6
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

const Login = () => {
  const navigate = useNavigate(); // Use navigate instead of history
  const [loginError, setLoginError] = useState(''); // State to store error message

  // Handle the form submission
  const handleSubmit = async (values) => {
    try {
      // Send the login request
      const response = await axios.post('http://localhost:5000/login', values);
      localStorage.setItem('token', response.data.token); // Store JWT token

      // Redirect to the 'products' page
      navigate('/products'); // Use navigate for redirection
    } catch (error) {
      setLoginError('Invalid credentials or server error'); // Display error message
      console.error('Login failed', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>
                <i className="fas fa-user-circle"></i> Login
              </h3>
            </div>
            <div className="card-body">
              {loginError && (
                <div className="alert alert-danger" role="alert">
                  {loginError}
                </div>
              )}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                  email: Yup.string().email('Invalid email format').required('Required'),
                  password: Yup.string().required('Required'),
                })}
                onSubmit={handleSubmit} // Call handleSubmit on form submit
              >
                <Form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </button>
                </Form>
              </Formik>
            </div>
            <div className="card-footer text-center">
              <p>
                Don't have an account? <a href="/register" className="text-primary">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
