//import { useState } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import { UsersTable } from "./UserTable";
import { SupplierTable } from "./SupplierTable";
import { SparePartsTable } from "./SparePartsTable";
import { InventoryTable } from "./InventoryTable";
import { RequestsForm } from "./RequestsForm";
import { ResponsesTable } from "./ResponsesTable";
import { UserOrdersTable } from "./UserOrdersTable";

export function AdminDashboard() {
  return (
    <Container className="py-4">
      <h2 className="text-danger fw-bold mb-4">Admin Dashboard</h2>

      <Tab.Container defaultActiveKey="users">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="users">Users</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="user-orders">User Orders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="suppliers">Suppliers</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="spareparts">Spare Parts</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="inventory">Inventory</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="requests">Send Request</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="responses">Responses</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="users"><UsersTable /></Tab.Pane>
          <Tab.Pane eventKey="user-orders" title="User Orders"><UserOrdersTable /></Tab.Pane>
          <Tab.Pane eventKey="suppliers"><SupplierTable /></Tab.Pane>
          <Tab.Pane eventKey="spareparts"><SparePartsTable /></Tab.Pane>
          <Tab.Pane eventKey="inventory"><InventoryTable /></Tab.Pane>
          <Tab.Pane eventKey="requests"><RequestsForm /></Tab.Pane>
          <Tab.Pane eventKey="responses"><ResponsesTable /></Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}