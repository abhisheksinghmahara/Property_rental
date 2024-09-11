// Footer.js
import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <div className="text-center">
          <p className="mb-0">© {new Date().getFullYear()} My Website. All rights reserved.</p>
          <p className="mb-0"> Project Showcase by <span className="text-danger">Abhishek Mahara</span> </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
