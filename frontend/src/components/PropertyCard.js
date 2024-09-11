import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/api';

// const BASE_URL = 'http://localhost:5001';
// const BASE_URL = 'https://totality-frontend-challenge-120r.onrender.com';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/property/${property._id}`);
  };

  const handleAddToCartClick = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Ensure the token key is correct
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Not Authenticated',
          text: 'Please log in to add items to your cart.',
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
          text: 'Item added to cart successfully!',
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add to Cart',
        text: 'There was an issue adding the item to your cart. Please try again.',
      });
    }
  };

  return (
    <Card className="mb-4" style={{ width: '100%', maxWidth: '18rem', height: '100%' }}>
      <Card.Img
        variant="top"
        src={property.imageUrl}
        alt={property.title}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <Card.Title>{property.title}</Card.Title>
          <Card.Text>
            <strong>Location:</strong> {property.location}
          </Card.Text>
          <Card.Text>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </Card.Text>
          <Card.Text>
            <strong>Price:</strong> INR {property.price}/Month
          </Card.Text>
        </div>
        <div className="mt-auto">
          <Button variant="primary" className="w-100 mb-2" onClick={handleViewClick}>
            View
          </Button>
          <Button variant="success" className="w-100" onClick={handleAddToCartClick}>
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
