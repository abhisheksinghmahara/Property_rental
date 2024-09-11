import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${BASE_URL}/api/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
        } else {
          setCartItems([]); // Adjust if your API's response structure is different
        }
      } catch (err) {
        console.error(err);
        setError('Cart Empty.'); // Set error message
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this item from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, keep it',
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${BASE_URL}/api/cart/remove/${itemId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCartItems(cartItems.filter(item => item._id !== itemId));
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Item has been removed from your cart.',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Remove',
        text: 'There was an issue removing the item from your cart. Please try again.',
      });
    }
  };

  const handleViewItem = (propertyId) => {
    navigate(`/property/${propertyId}`); // Redirect to the property details page
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

  return (
    <Container className="mt-4">
      <h2>Cart</h2>
      {error && (
        <Alert variant="info">
          {error} {/* Display error as informational alert */}
        </Alert>
      )}
      {cartItems.length === 0 ? (
        <Alert variant="info">No items in your cart yet.</Alert>
      ) : (
        <Row>
          {cartItems.map(item => (
            <Col md={4} key={item._id} className="mb-3">
              <Card>
                <Card.Img 
                  variant="top" 
                  src={item.propertyId.imageUrl} 
                  width={"200px"} 
                  height={"300px"} 
                  alt={item.propertyId.title} 
                />
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <Card.Title>{item.propertyId.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Price: INR {item.propertyId.price}/Month
                    </Card.Subtitle>
                  </div>
                  <div className="mt-auto">
                    <Button 
                      variant="info" 
                      className="w-100 mb-2" 
                      onClick={() => handleViewItem(item.propertyId._id)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="danger" 
                      className="w-100" 
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Cart;
