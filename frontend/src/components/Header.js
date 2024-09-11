import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { BASE_URL } from '../utils/api';

const Header = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [location]);

  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, stay logged in'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        }

        // Clear user data and token from local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Update state
        setUser(null);

        // Show success message
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been logged out successfully.',
          icon: 'success'
        });

      } catch (error) {
        console.error('Error logging out:', error);
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong while logging out.',
          icon: 'error'
        });
      }
    }
  };

  return (
    <Navbar className='bg-primary' expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="ps-3.5 text-light fw-bolder">
          Property Rental
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="pe-5">
          <Nav className="ms-auto text-light fw-bold">
            <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/cart" className="text-light">Cart</Nav.Link>
                <Nav.Link as={Link} to="/allbookings" className="text-light">Bookings</Nav.Link>
                <Nav.Link as="button" onClick={handleLogout} className="text-light">
                  Logout
                </Nav.Link>
                <Navbar.Text>
                   <i className="bi bi-house-door">Hi, {user.name}</i>
                </Navbar.Text>
              </>
            ) : (
              <>
                <Nav.Link className='text-light' as={Link} to="/login">Login</Nav.Link>
                <Nav.Link className='text-light' as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
