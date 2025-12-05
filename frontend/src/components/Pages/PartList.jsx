import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllParts } from "../../services/UserPartService";
import sparePart from "../../assets/images/spare-part.jpg"
import blank from "../../assets/images/blank.jpg"

export function PartsList() {
  const [parts, setParts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await getAllParts();
      setParts(response.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  return (
    <Container className="py-5">
      <h3 className="text-center mb-4 text-danger fw-semibold">Available Spare Parts</h3>
      <Row>
        {parts.length > 0 ? (
          parts.map((part) => (
            <Col md={4} sm={6} key={part.sparePart_id} className="mb-4">
              <Card className="shadow-lg h-100 border-1 rounded-3">
                <Card.Img
                  variant="top"
                  src={sparePart}
                  className="p-3"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <Card.Body className="text-dark">
                  <Card.Title>{part.sparePartName}</Card.Title>
                  <Card.Text className="text-muted">
                    ₹{Number(part.price || 0).toFixed(2)}<br />
                    <small>In Stock: <span className="border-danger text-danger">{part.currentStock}</span></small>
                  </Card.Text>
                  <Card.Text>

                  </Card.Text>
                  <Button
                    variant="danger"
                    className="fw-semibold w-100"
                    onClick={() => navigate(`/parts/${part.sparePart_id}`)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={12} className="d-flex align-items-center justify-content-center">
            <Card className="my-4 shadow w-50">
              <Card.Img
                  variant="top"
                  src={blank}
                  className="p-3 card-img-top"
                />
                <Card.Body className="text-center">
                  <Card.Title className="text-danger display-6 fw-bold mb-2">Sorry!!! </Card.Title>
                  <Card.Title className="h1 fw-bold">We Are Running Out Of Stock</Card.Title>
                </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}