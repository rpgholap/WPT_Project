import { Container, Nav, Tab } from "react-bootstrap";
import { AssignedRequests } from "./AssignedRequests";
import { MyResponses } from "./MyResponses";
import { DeliveryStatus } from "./DeliveryStatus";

export function SupplierDashboard() {
  return (
    <Container className="py-4">
      <h2 className="text-danger fw-bold mb-4">Supplier Dashboard</h2>

      <Tab.Container defaultActiveKey="requests">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="requests">Assigned Requests</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="responses">My Responses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="delivery">Delivery Status</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="requests"><AssignedRequests /></Tab.Pane>
          <Tab.Pane eventKey="responses"><MyResponses /></Tab.Pane>
          <Tab.Pane eventKey="delivery"><DeliveryStatus /></Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}