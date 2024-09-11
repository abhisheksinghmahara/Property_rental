import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { BASE_URL } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      const { token, user } = response.data;

      // Store token and user information in local storage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Show success popup
      Swal.fire({
        title: 'Login Successful!',
        text: 'You will be redirected to the homepage shortly.',
        icon: 'success',
        timer: 2000, // 2 seconds before redirect
        showConfirmButton: false,
        willClose: () => {
          setLoading(false); // Stop loader
          navigate('/'); // Redirect to homepage
        },
      });
    } catch (err) {
      setLoading(false); // Stop loader
      setError(err.response?.data?.message || 'Login failed');

      // Show error popup
      Swal.fire({
        title: 'Login Failed!',
        text: err.response?.data?.message || 'Incorrect email or password.',
        icon: 'error',
      });
    }
  };

  return (
    <Container className="mt-4">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Login
          </Button>
        </Form>
      )}
      <div className="mt-4">
        <p>Don't have an account?</p>
        <Button variant="link" as={Link} to="/register">
          Register here
        </Button>
      </div>
    </Container>
  );
};

export default Login;
