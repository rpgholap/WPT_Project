import { useState } from "react";
import { Carousel, Card, Container, Row, Col } from "react-bootstrap";
import bike1 from "../../assets/images/bike1.jpg";
import bike2 from "../../assets/images/bike2.jpg";
import bike3 from "../../assets/images/bike3.jpg";
import spare1 from "../../assets/images/spare1.jpg"

export function Home() {
  const [paused, setPaused] = useState(false);

  const testimonials = [
    {
      name: "Rahul Mehta",
      text: "Amazing platform! Managing spare parts became effortless for our garage.",
    },
    {
      name: "Priya Singh",
      text: "User-friendly dashboard and accurate stock tracking. Loved the UI!",
    },
    {
      name: "Amit Verma",
      text: "Fast, reliable, and intuitive. This system made inventory management fun!",
    },
  ];

  return (
    <>

      {/* ===== SLIDER SECTION ===== */}
      <section className="home-slider">
        <Carousel fade interval={3000} pause={paused ? "hover" : false}>
        <Carousel.Item>
            <img className="d-block w-100 slider-img" src={spare1} alt="Spare 1" />
            <Carousel.Caption>
              <h3>Quality Spare Parts</h3>
              <p>Reliable, affordable, and ready to ship worldwide.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100 slider-img" src={bike1} alt="Bike 1" />
            <Carousel.Caption>
              <h3>Quality Spare Parts</h3>
              <p>Reliable, affordable, and ready to ship worldwide.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100 slider-img" src={bike2} alt="Bike 2" />
            <Carousel.Caption>
              <h3>For Every Rider</h3>
              <p>We stock OEM and aftermarket parts for all major brands.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100 slider-img" src={bike3} alt="Bike 3" />
            <Carousel.Caption>
              <h3>Performance You Can Trust</h3>
              <p>Engineered for durability and peak performance.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* ===== WHY US SECTION ===== */}
      <section className="why-us py-5 text-center">
        <Container>
          <h2 className="fw-semibold mb-4 text-danger">Why Choose Us</h2>
          <Row className="gy-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 vision-card">
                <Card.Body className="text-white">
                  <Card.Title className="fw-bold">
                    Genuine Quality
                  </Card.Title>
                  <Card.Text>
                    All our parts are sourced from trusted manufacturers to ensure
                    long-lasting performance.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 vision-card">
                <Card.Body  className="text-white">
                  <Card.Title className="fw-bold">
                    Fast Delivery
                  </Card.Title>
                  <Card.Text>
                    We maintain high stock levels to ensure same-day dispatch and
                    faster delivery times.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0 vision-card">
                <Card.Body className="text-white">
                  <Card.Title className="fw-bold">
                    24/7 Support
                  </Card.Title>
                  <Card.Text>
                    Our customer service is available around the clock to assist
                    you with all your queries.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section
        className="testimonials py-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Container>
          <h2 className="text-center fw-semibold mb-4 text-danger">
            What Our Clients Say
          </h2>
          <Carousel interval={2500} pause={paused ? "hover" : false} indicators={false}>
            {testimonials.map((item, index) => (
              <Carousel.Item key={index}>
                <div className="testimonial-card text-center mx-auto p-4 shadow-sm">
                  <p className="fst-italic mb-3">"{item.text}"</p>
                  <h6 className="fw-bold text-dark">{item.name}</h6>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>
    </>
  );
}
