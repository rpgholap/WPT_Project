import { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
  Button,
  Image,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/images/spare-logo-big.png";
import SmallLogo from "../../assets/images/spare-logo-small.png";
import { LinkContainer } from "react-router-bootstrap";
import { removeToken } from "../../services/TokenService";
import { getRole, removeRole } from "../../services/RoleService";
import { getUser, removeUser } from "../../services/UserService";
import { ROLES } from "../../constants/RoleConstant";

function NavigationBar() {
  const navigate = useNavigate();
  const role = parseInt(getRole());
  const user = parseInt(getUser());

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    removeRole();
    removeUser();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`custom-navbar ${isScrolled ? "scrolled" : ""}`}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={isScrolled ? SmallLogo : Logo}
            alt="Spare Parts Logo"
            className="navbar-logo img-fluid me-2"
            style={{ maxHeight: "60px" }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls={`offcanvasNavbar`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar`}
          aria-labelledby={`offcanvasNavbarLabel`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel`}>
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
              {/* Common Links (visible to all) */}
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contact">
                <Nav.Link>Contact</Nav.Link>
              </LinkContainer>

              {/* Role-Based Tabs */}
              {role === ROLES.USER && (
                <>
                  <LinkContainer to="/parts">
                    <Nav.Link>Buy Parts</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <Nav.Link>My Orders</Nav.Link>
                  </LinkContainer>
                </>
              )}
              {role === ROLES.ADMIN && (
                <LinkContainer to="/dashboard/admin">
                  <Nav.Link>Admin Dashboard</Nav.Link>
                </LinkContainer>
              )}
              {role === ROLES.SUPPLIER && (
                <LinkContainer to="/dashboard/supplier">
                  <Nav.Link>Supplier Dashboard</Nav.Link>
                </LinkContainer>
              )}
            </Nav>

            {/* User Auth Section */}
            <div className="d-flex align-items-center gap-3">
              {user ? (
                <>
                  <div className="d-flex align-items-center">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      roundedCircle
                      width="35"
                      height="35"
                      className="me-2 border border-2 border-light"
                    />
                    <span className="fw-semibold">
                      {role === 1
                        ? "Hello Admin"
                        : role === 2
                        ? "Hello Supplier"
                        : "Hello User"}
                    </span>
                  </div>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavigationBar