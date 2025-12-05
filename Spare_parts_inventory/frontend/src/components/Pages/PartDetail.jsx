import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getPartById, addToCart, buyNow } from "../../services/UserPartService";
import { getToken } from "../../services/TokenService";
import sparePart from "../../assets/images/spare-part.jpg";

export function PartDetail() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    const fetchPart = async () => {
    try {
      const response = await getPartById(id);
      setPart(response.data);
    } catch (error) {
      console.error("Error fetching part details:", error);
    }
  };
  fetchPart()
  }, [id]);

  useEffect(() => {
    if (part && part.price) {
      setTotalPrice(quantity * part.price);
    }
  }, [quantity, part]);

  const goBack = () => {
    navigate("/parts");
  }

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= part.quantityInStock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ sparePart_id: id, quantity, price: part.price }, token);
      toast.success("Added to Cart Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart.");
    }
  };

  const handleBuyNow = async () => {
    try {
      await buyNow({ sparePart_id: id, quantity, price: part.price }, token);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    }
  };

  if (!part) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="py-3">
      <Row className="text-end">
        <Col sm={12} className="mb-3">
          <Button className="btn btn-md btn-secondary" onClick={goBack}>Go Back</Button>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Img
              variant="top"
              src={sparePart}
              className="p-4"
              style={{ height: "350px", objectFit: "contain" }}
            />
          </Card>
        </Col>

        <Col md={6}>
          <h3 className="fw-bold text-danger">{part.part_name}</h3>
          <p className="text-muted mb-2">{part.description}</p>

          <p className="fw-semibold mb-2">
            <strong>Stock:</strong>{" "}
            {part.currentStock > 0 ? (
              <span className="text-success">{part.currentStock} available</span>
            ) : (
              <span className="text-danger">Out of stock</span>
            )}
          </p>

          <h5 className="mb-3">
            Price per unit: ₹{Number(part.price || 0).toFixed(2)}
          </h5>

          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label className="fw-semibold">Select Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={part.stock}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: "120px" }}
              disabled={part.stock === 0}
            />
          </Form.Group>

          <h5 className="mb-4 text-dark fw-semibold">
            Total Price: ₹{Number(totalPrice).toFixed(2)}
          </h5>

          <div className="d-flex gap-3">
            <Button
              variant="outline-danger"
              className="fw-semibold px-4"
              onClick={handleAddToCart}
              disabled={part.stock === 0 || quantity === 0}
            >
              Add to Cart
            </Button>

            <Button
              variant="danger"
              className="fw-semibold px-4"
              onClick={handleBuyNow}
              disabled={part.stock === 0 || quantity === 0}
            >
              Buy Now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}