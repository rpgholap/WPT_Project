import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, CardFooter } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { getToken, storeToken } from "../../services/TokenService";
import { login } from "../../services/LoginServices";
import { getRole, storeRole } from "../../services/RoleService";
import { getUser, storeUser } from "../../services/UserService";
import Logo from "../../assets/images/spare-logo-big.png";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    useEffect(() => {
        const token = getToken();
        const role = getRole();
        const userId = getUser();
        if (token) {
            if(role == 1 && userId)
            navigate("/");
            else if(role == 2 && userId)
                navigate("/");
            else if(role == 3 && userId)
                navigate("/");
            else
                navigate("/login")
        }
    }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

      try {
            e.preventDefault();
            console.log(formData);
            const response = await login(formData);
            if (response.status === 200) {
                storeToken(response.data.token);
                storeRole(response.data.role);
                storeUser(response.data.user_id);
                toast.success("Login Successful", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
                navigate("/")
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                if (error.response.status === 400 || error.response.status === 500) {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                    })
                }
            }
        }
    
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="shadow-lg border-0 rounded-4 p-3">
              {/* ===== Logo Header ===== */}
              <Card.Header className="bg-white text-center border-0 pb-0">
                <img
                  src={Logo}
                  alt="Spare Parts Logo"
                  className="img-fluid mb-3"
                  style={{ maxHeight: "80px" }}
                />
                <h5 className="fw-semibold text-danger">Spare Parts Inventory</h5>
              </Card.Header>

              {/* ===== Card Body ===== */}
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      placeholder="Enter your email"
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      placeholder="Enter your password"
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="danger" type="submit" className="fw-semibold">
                      Login
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-center mt-2">
                <p className="mb-0 text-muted">
                  Don’t have an account?{" "}
                  <span
                    className="text-danger fw-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    Register here
                  </span>
                </p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}