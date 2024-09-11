import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Alert, Spinner, Button } from 'react-bootstrap'; // Import Button
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/properties`);
        setProperties(response.data);
      } catch (err) {
        setError('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Function to reset filters to initial state
  const resetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
    });
  };

  const applyFilters = (properties) => {
    return properties.filter((property) => {
      const { location, minPrice, maxPrice, minBedrooms } = filters;

      const matchLocation = location ? property.location.toLowerCase().includes(location.toLowerCase()) : true;
      const matchMinPrice = minPrice ? property.price >= Number(minPrice) : true;
      const matchMaxPrice = maxPrice ? property.price <= Number(maxPrice) : true;
      const matchMinBedrooms = minBedrooms ? property.bedrooms >= Number(minBedrooms) : true;

      return matchLocation && matchMinPrice && matchMaxPrice && matchMinBedrooms;
    });
  };

  const filteredProperties = applyFilters(properties);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Properties</h2>

      {/* Loader displayed while loading */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Form className="mb-4">
            <Row>
              <Col md={3}>
                <Form.Group controlId="formLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formMinPrice">
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    placeholder="Enter min price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formMaxPrice">
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    placeholder="Enter max price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formMinBedrooms">
                  <Form.Label>Bedrooms (Min)</Form.Label>
                  <Form.Control
                    type="number"
                    name="minBedrooms"
                    placeholder="Enter min bedrooms"
                    value={filters.minBedrooms}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Reset Filters Button */}
            <Row className="mt-3">
              <Col>
                <Button variant="secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </Col>
            </Row>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            {filteredProperties.length === 0 ? (
              <Col>
                <Alert variant="info">No properties found with the current filters.</Alert>
              </Col>
            ) : (
              filteredProperties.map((property) => (
                <Col md={4} key={property._id} className="mb-4">
                  <PropertyCard property={property} />
                </Col>
              ))
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
