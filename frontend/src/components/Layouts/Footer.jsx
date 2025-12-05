import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import Logo from "../../assets/images/spare-logo-small.png";

export function Footer() {
  return (
    <footer className="footer mt-auto py-4">
      <Container>
        <Row className="align-items-center gy-3">
          {/* Logo + Branding */}
          <Col md={4} className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <img
                src={Logo}
                alt="Spare Parts Logo"
                className="footer-logo me-2"
              />
              <h6 className="mb-0 fw-semibold text-dark">
                Spare Parts Inventory
              </h6>
            </div>
            <small className="text-muted d-block mt-1">
              © {new Date().getFullYear()} All Rights Reserved
            </small>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="text-center">
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#inventory">Inventory</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </Col>

          {/* Social Icons */}
          <Col
            md={4}
            className="d-flex justify-content-center justify-content-md-end gap-3"
          >
            <a href="#" aria-label="Facebook" className="social-icon">
              <FaFacebookF size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="social-icon">
              <FaLinkedinIn size={20} />
            </a>
            <a href="#" aria-label="GitHub" className="social-icon">
              <FaGithub size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="social-icon">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="social-icon">
              <FaInstagram size={20} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}