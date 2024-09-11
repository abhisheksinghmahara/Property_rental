import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, { name, email, password });
      
      // Show success popup
      Swal.fire({
        title: 'Registration Successful!',
        text: 'You will be redirected to the login page shortly.',
        icon: 'success',
        timer: 2000, // 2 seconds before redirect
        showConfirmButton: false,
        willClose: () => {
          setLoading(false); // Stop loader
          navigate('/login');
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false); // Stop loader
    }
  };

  return (
    <Container className="mt-4">
      <h2>Register</h2>
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
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
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
            Register
          </Button>
        </Form>
      )}
      <div className="mt-4">
        <p>Already have an account?</p>
        <Button variant="link" as={Link} to="/login">
          Login here
        </Button>
      </div>
    </Container>
  );
};

export default Register;