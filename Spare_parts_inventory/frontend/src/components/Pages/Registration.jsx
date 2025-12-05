import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Row,Col,Card,Form,Button,Alert,} from "react-bootstrap";
import Logo from "../../assets/images/spare-logo-big.png";
import { registration } from "../../services/RegistrationService";
import { Bounce, toast } from "react-toastify";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role_id: "",
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    state: "",
    city: "",
    supplier_code: "",
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/; // 6+ chars, 1 uppercase, 1 number
  const phoneRegex = /^[6-9]\d{9}$/;
  const nameRegex = /^[A-Za-z\s]{3,30}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();
        const newErrors = {};

        if (!formData.role_id) newErrors.role_id = "Please select your role";

        if (!formData.name.trim()) newErrors.name = "Full name is required";
        else if (!nameRegex.test(formData.name))
        newErrors.name = "Name must be alphabetic and 3-30 characters long";

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email))
        newErrors.email = "Enter a valid email address";

        if (!formData.password.trim()) newErrors.password = "Password is required";
        else if (!passwordRegex.test(formData.password))
        newErrors.password =
            "Password must be 6+ chars, include 1 uppercase & 1 number";

        if (!formData.confirm_password.trim())
        newErrors.confirm_password = "Please confirm your password";
        else if (formData.password !== formData.confirm_password)
        newErrors.confirm_password = "Passwords do not match";

        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!phoneRegex.test(formData.phone))
        newErrors.phone = "Enter a valid 10-digit phone number";

        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.city.trim()) newErrors.city = "City is required";

        if (formData.role_id === "supplier") {
            if (!formData.supplier_code.trim()) {
                newErrors.supplier_code = "Supplier code is required";
            } else if (formData.supplier_code.trim() !== "supplier123") {
                newErrors.supplier_code = "Invalid supplier code! Please contact the company owner.";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const userData = {
            role_id: formData.role_id === "user" ? 3 : 2,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            state: formData.state,
            city: formData.city,
            supplier_code:
            formData.role_id === "user" ? "" : formData.supplier_code,
        };

        const response = await registration(userData);
        console.log("Registration Response:", response);

        if (response.status === 201) {
        toast.success(`Successfully Registered as a ${formData.role_id}`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
        setTimeout(() => navigate("/login"), 5000);
        } else {
            toast.error("Unexpected response. Please try again later.", {
                position: "top-right",
                theme: "colored",
            });
        }
        
    } catch (error) {
        console.error("Registration Error:", error);

        if (error.response?.status === 409) {
            toast.error(`${formData.name} Already Exist With Email Or Phone`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } else {
            toast.error("Something went wrong! Try again.", {
                position: "top-right",
                theme: "colored",
            });
        }
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center">
      <Card className="shadow-lg border-0 rounded-4 p-3">
        {/* ===== Header with Logo ===== */}
        <Card.Header className="bg-white text-center border-0 pb-0">
          <img
            src={Logo}
            alt="Spare Parts Logo"
            className="img-fluid mb-3"
            style={{ maxHeight: "80px" }}
          />
          <h5 className="fw-semibold text-danger">Create an Account</h5>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Select Role</Form.Label>
                    <Form.Select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        isInvalid={!!errors.role_id}>
                        <option value="" disabled>
                        -- Select Role --
                        </option>
                        <option value="user">User</option>
                        <option value="supplier">Supplier</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.role_id}
                    </Form.Control.Feedback>
                </Form.Group>
            <Row>
              <Col md={6}>
                {/* Name */}
                <Form.Group className="mb-3" controlId="registerName">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Email */}
                <Form.Group className="mb-3" controlId="registerEmail">
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
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                {/* Password */}
                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter password"
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Confirm Password */}
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label className="fw-semibold">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    placeholder="Re-enter password"
                    onChange={handleChange}
                    isInvalid={!!errors.confirm_password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm_password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Phone */}
            <Form.Group className="mb-3" controlId="registerPhone">
              <Form.Label className="fw-semibold">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="Enter your phone number"
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* State & City */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="registerState">
                  <Form.Label className="fw-semibold">State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    placeholder="Enter state"
                    onChange={handleChange}
                    isInvalid={!!errors.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="registerCity">
                  <Form.Label className="fw-semibold">City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder="Enter city"
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Supplier Code (only if supplier) */}
            {formData.role_id === "supplier" && (
              <>
                <Form.Group className="mb-2" controlId="supplierCode">
                  <Form.Label className="fw-semibold">Supplier Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="supplier_code"
                    value={formData.supplier_code}
                    placeholder="Enter supplier code"
                    onChange={handleChange}
                    isInvalid={!!errors.supplier_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.supplier_code}
                  </Form.Control.Feedback>
                </Form.Group>

                <Alert variant="warning" className="py-2 small">
                  To enter supplier code, contact the company owner. Your
                  verification will be done by them.
                </Alert>
              </>
            )}

            {/* Submit Button */}
            <div className="d-grid mt-3">
              <Button variant="danger" type="submit" className="fw-semibold">
                Register
              </Button>
            </div>

            {/* Link to Login */}
            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <span
                className="text-danger fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
