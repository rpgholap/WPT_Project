import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

export function Contact() {
  return (
    <>
      <div className="contact-page">
        {/* ===== Contact Banner ===== */}
        <section className="contact-banner d-flex align-items-center justify-content-center">
          <h1 className="fw-bold text-white display-5">Contact Us</h1>
        </section>

        {/* ===== Contact Details Section ===== */}
        <section className="py-5 bg-light">
          <Container>
            <h3 className="text-center text-danger fw-semibold mb-4">
              Contact Details
            </h3>
            <Row className="gy-4 text-center">
              <Col md={4}>
                <div className="contact-info">
                  <h5 className="fw-bold mb-2">📞 Phone</h5>
                  <p className="text-secondary mb-0">+91 98765 43210</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="contact-info">
                  <h5 className="fw-bold mb-2">📧 Email</h5>
                  <p className="text-secondary mb-0">
                    support@spareinventory.com
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="contact-info">
                  <h5 className="fw-bold mb-2">📍 Address</h5>
                  <p className="text-secondary mb-0">
                    CDAC Campus, Mumbai, India
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ===== Contact Form Section ===== */}
        <section className="py-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="shadow border-0 p-4 rounded-4">
                  <h3 className="text-center mb-4 text-danger fw-semibold">
                    Get In Touch
                  </h3>
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="contactName">
                          <Form.Label className="fw-semibold">
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="contactEmail">
                          <Form.Label className="fw-semibold">
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="contactSubject">
                      <Form.Label className="fw-semibold">Subject</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your subject"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="contactMessage">
                      <Form.Label className="fw-semibold">Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Write your message here..."
                        required
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button
                        variant="danger"
                        type="submit"
                        className="px-5 fw-semibold"
                      >
                        Send Message
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ===== Contact Map Section ===== */}
        <section className="map-section">
          <Container fluid className="p-0">
            <iframe
              title="Spare Parts Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.8130352081924!2d72.96633487518943!3d19.16298348205403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9c96b0e3a2b%3A0x983b1b982a15c70b!2sCDAC%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Container>
        </section>
      </div>
    </>
  );
}
