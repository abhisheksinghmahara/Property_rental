import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/api';

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${BASE_URL}/api/properties/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to fetch property details');
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleAddToCartClick = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Required',
          text: 'You need to be logged in to add items to the cart.',
        });
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/cart/add`,
        {
          propertyId: property._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart',
          text: 'Item has been added to your cart successfully!',
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add to Cart',
        text: 'Failed to add item to cart. It might already be in your cart.',
      });
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Dates',
        text: 'Please provide both start and end dates.',
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Found',
        text: 'You need to be logged in to proceed to checkout.',
      });
      return;
    }

    // Create a booking in the database and get the booking ID
    axios.post(`${BASE_URL}/api/bookings`, {
      userId: user.id,
      properties: [
        {
          property: property._id,  // Send only the property ID
          startDate: startDate,
          endDate: endDate,
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }).then(response => {
      const bookingId = response.data._id;
      navigate('/confirmbooking', {
        state: {
          bookingId,
        },
      });
    }).catch(error => {
      console.error('Error creating booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: 'Failed to create booking. Please try again.',
      });
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!property) return <p>No property details available.</p>;

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Img 
          variant="top" 
          src={property.imageUrl} 
          alt={property.title} 
          style={{ height: '600px', objectFit: 'cover' }} 
        />
        <Card.Body>
          <Card.Title>{property.title}</Card.Title>
          <Card.Text>
            <strong>Location:</strong> {property.location}
          </Card.Text>
          <Card.Text>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </Card.Text>
          <Card.Text>
            <strong>Amenities:</strong> {property.amenities.join(', ')}
          </Card.Text>
          <Card.Text>
            <strong>Description:</strong> {property.description}
          </Card.Text>
          <Card.Text>
            <strong>Price:</strong> INR {property.price}/Month
          </Card.Text>
          <Button variant="success" onClick={handleAddToCartClick}>
            Add to Cart
          </Button>
          <Form onSubmit={handleCheckout} className="mt-4">
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                required
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Proceed to Checkout
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PropertyDetails;
