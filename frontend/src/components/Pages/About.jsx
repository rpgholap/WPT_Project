import { Container, Row, Col, Card } from "react-bootstrap";
import spare1 from "../../assets/images/spare1.jpg"; // ← replace with your own image

export function About() {
  return (
    <>
      <div className="about-page">
        {/* ===== Banner Section (Parallax) ===== */}
        <section className="about-banner d-flex align-items-center justify-content-center">
          <h1 className="fw-bold text-white display-5">About Us</h1>
        </section>

        {/* ===== About Description Section ===== */}
        <section className="py-5 about-content">
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="mb-4 mb-md-0">
                <img
                  src={spare1}
                  alt="About Spare Parts"
                  className="img-fluid rounded shadow-sm"
                />
              </Col>
              <Col md={6}>
                <h3 className="fw-bold text-danger mb-3">Who We Are</h3>
                <p className="text-secondary mb-3">
                  Spare Parts Inventory Management System is designed to
                  simplify and optimize how businesses handle automotive spare
                  parts. Our platform helps workshops, resellers, and suppliers
                  maintain accurate stock levels and ensure timely availability
                  of components.
                </p>
                <p className="text-secondary mb-3">
                  With real-time updates, our system minimizes downtime, boosts
                  productivity, and provides detailed insights into every
                  component of your inventory.
                </p>
                <p className="text-secondary">
                  We are driven by innovation and a commitment to building trust
                  in every transaction. Our goal: empower businesses to stay
                  ahead in a fast-evolving automotive industry.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ===== Mission & Vision Section ===== */}
        <section className="py-5 text-center">
          <Container>
            <h2 className="fw-semibold mb-4 text-danger">Our Purpose</h2>
            <Row className="gy-4">
              <Col md={6}>
                <Card className="h-100 mission-card text-white border-0 shadow-sm">
                  <Card.Body>
                    <h4 className="fw-bold mb-3">Our Mission</h4>
                    <p>
                      To deliver genuine, high-quality spare parts that empower
                      workshops and individuals to maintain their vehicles with
                      confidence and performance assurance.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 vision-card text-white border-0 shadow-sm">
                  <Card.Body>
                    <h4 className="fw-bold mb-3">Our Vision</h4>
                    <p>
                      To be the most trusted and customer-focused spare parts
                      supplier globally, ensuring every ride is safe, smooth,
                      and reliable through our inventory solutions.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
}