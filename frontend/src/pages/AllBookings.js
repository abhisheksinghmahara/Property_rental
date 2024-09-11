import React, { useState, useEffect } from 'react';
import { Card, Alert, Button, Spinner } from 'react-bootstrap'; // Import Spinner
import Swal from 'sweetalert2'; // Import SweetAlert2
import { BASE_URL } from '../utils/api';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const localuser = localStorage.getItem('user');
        const localuserid = JSON.parse(localuser);
        const userId = localuserid.id;

        if (!userId) {
          throw new Error('User not logged in');
        }

        const response = await fetch(`${BASE_URL}/api/bookings/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          throw new Error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to handle cancellation
  const handleCancel = async (bookingId, propertyId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to cancel this booking?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No, keep it',
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'Cancelled' }),
        });

        if (response.ok) {
          const updatedBookings = bookings.map(booking => {
            if (booking._id === bookingId) {
              booking.properties = booking.properties.map(prop => {
                if (prop.property._id === propertyId) {
                  return { ...prop, status: 'Cancelled' };
                }
                return prop;
              });
              booking.status = 'Cancelled';
            }
            return booking;
          });
          setBookings(updatedBookings); // Reflect cancellation immediately
          await Swal.fire({
            title: 'Cancelled!',
            text: 'Your booking has been cancelled.',
            icon: 'success',
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to cancel booking.');
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      await Swal.fire({
        title: 'Cancellation Failed',
        text: error.message,
        icon: 'error',
      });
    }
  };

  // Function to handle booking confirmation
  const handleBookNow = async (bookingId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Confirmed' }),
      });

      if (response.ok) {
        const updatedBookings = bookings.map(booking => {
          if (booking._id === bookingId) {
            booking.status = 'Confirmed';
          }
          return booking;
        });
        setBookings(updatedBookings); // Reflect confirmation immediately
        await Swal.fire({
          title: 'Booking Confirmed!',
          text: 'Your booking has been confirmed.',
          icon: 'success',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to confirm booking.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      await Swal.fire({
        title: 'Booking Failed',
        text: error.message,
        icon: 'error',
      });
    }
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

  if (error) return <Alert variant="danger">{error}</Alert>;

  // Show alert if there are no bookings
  if (bookings.length === 0) {
    return (
      <Alert variant="info" className="text-center mt-4">
        Nothing is in your booking history yet.
      </Alert>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Booking History</h2>
      <div className="row">
        {bookings
          .slice(0) // Create a shallow copy to avoid mutating the original array
          .reverse() // Reverse the order of items
          .map((booking) =>
            booking.properties.map((prop, index) => {
              const currentDate = new Date();
              const startDate = new Date(prop.startDate);
              const isCancelable = startDate > currentDate; // Only allow cancellation if start date hasn't passed
              const isPending = booking.status === 'Pending';
              const isCancelled = booking.status === 'Cancelled';

              return (
                <div className="col-md-4 mb-4" key={`${booking._id}-${index}`}>
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={prop.property.imageUrl}
                      alt={prop.property.title}
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="mb-2">{prop.property.title}</Card.Title>
                      <Card.Text className="mb-2">
                        <strong>Location:</strong> {prop.property.location}
                      </Card.Text>
                      <Card.Text className="mb-2">
                        <strong>Start Date:</strong> {startDate.toLocaleDateString()}
                      </Card.Text>
                      <Card.Text className="mb-2">
                        <strong>End Date:</strong> {new Date(prop.endDate).toLocaleDateString()}
                      </Card.Text>
                      <Card.Text className="mb-2">
                        <strong>Total Cost:</strong> INR {prop.cost.toFixed(2)}
                      </Card.Text>
                      <Card.Text className="mb-3">
                        <strong>Status:</strong> {booking.status}
                      </Card.Text>
                      {isPending && !isCancelled ? (
                        <div className="d-flex gap-2">
                          <Button
                            variant="danger"
                            onClick={() => handleCancel(booking._id, prop.property._id)}
                            disabled={!isCancelable} // Disable cancel if the start date has passed
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="success"
                            onClick={() => handleBookNow(booking._id)}
                          >
                            Confirm Booking
                          </Button>
                        </div>
                      ) : isCancelable && !isCancelled ? (
                        <Button 
                          variant="danger"
                          onClick={() => handleCancel(booking._id, prop.property._id)}
                        >
                          Cancel Now
                        </Button>
                      ) : null}
                    </Card.Body>
                  </Card>
                </div>
              );
            })
          )}
      </div>
    </div>
  );
};

export default AllBookings;