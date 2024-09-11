import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./pages/Footer";
import "./App.css"; // Custom CSS for layout
import 'bootstrap/dist/css/bootstrap.min.css';

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Cart = lazy(() => import("./components/Cart"));
const ConfirmBooking = lazy(() => import("./pages/ConfirmBooking"));
const AllBookings = lazy(() => import("./pages/AllBookings"));

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <div className="container mt-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/confirmbooking" element={<ConfirmBooking />} />
                <Route path="/allbookings" element={<AllBookings />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
