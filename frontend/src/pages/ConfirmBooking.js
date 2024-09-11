import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BASE_URL } from '../utils/api';

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  // Fetch booking details based on bookingId
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${BASE_URL}/api/bookings/booking/${bookingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          throw new Error('Failed to fetch booking details.');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to fetch booking details.');
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // Confirm booking
  const handleBookNow = async () => {
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
        await Swal.fire({
          title: 'Booking Confirmed!',
          text: 'Your booking has been confirmed.',
          icon: 'success',
        });
        navigate('/cart');
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

  // Cancel booking
  const handleCancelBooking = async () => {
    navigate(`/property/${booking?.properties[0]?.property._id}`);
    // try {
    //   const result = await Swal.fire({
    //     title: 'Are you sure?',
    //     text: 'Do you really want to cancel this booking?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, cancel it!',
    //     cancelButtonText: 'No, keep it',
    //   });

    //   if (result.isConfirmed) {
    //     const token = localStorage.getItem('authToken');
    //     const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({ status: 'Cancelled' }),
    //     });

    //     if (response.ok) {
    //       await Swal.fire({
    //         title: 'Cancelled!',
    //         text: 'Your booking has been cancelled.',
    //         icon: 'success',
    //       });
    //       navigate(`/property/${booking?.properties[0]?.property._id}`);
    //     } else {
    //       const errorData = await response.json();
    //       throw new Error(errorData.message || 'Failed to cancel booking.');
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error cancelling booking:', error);
    //   await Swal.fire({
    //     title: 'Cancellation Failed',
    //     text: error.message,
    //     icon: 'error',
    //   });
    // }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!booking) return <p>Loading...</p>;

  const isPending = booking.status === 'Pending';

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Confirm Booking</Card.Title>
          <Card.Text>
            <strong>Property:</strong> {booking.properties[0].property.title}
          </Card.Text>
          <Card.Text>
            <strong>Location:</strong> {booking.properties[0].property.location}
          </Card.Text>
          <Card.Text>
            <strong>Start Date:</strong> {new Date(booking.properties[0].startDate).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            <strong>End Date:</strong> {new Date(booking.properties[0].endDate).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            <strong>Total Cost:</strong> INR {booking.properties[0].cost.toFixed(2)}
          </Card.Text>
          {isPending ? (
            <>
              <Button variant="danger" onClick={handleCancelBooking} className="me-2">
                Cancel
              </Button>
              <Button variant="success" onClick={handleBookNow}>
                Book Now
              </Button>
            </>
          ) : (
            <Button variant="success" onClick={handleBookNow}>
              Book Now
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConfirmBooking;
