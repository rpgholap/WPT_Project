import { useEffect, useState } from "react";
import { Table, Button, Spinner, Form } from "react-bootstrap";
import { getAllUserOrders, updateOrderStatus } from "../../../../services/AdminServices";
import { toast } from "react-toastify";

export function UserOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllUserOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setProcessing(orderId);
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h4 className="text-danger fw-bold mb-4">User Orders</h4>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found.</p>
      ) : (
        <Table bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Part</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Current Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.orderDetailsID}>
                <td>{i + 1}</td>
                <td>{o.user_name}</td>
                <td>{o.user_email}</td>
                <td>{o.sparePartName}</td>
                <td>{o.quantity}</td>
                <td>₹{o.unit_price}</td>
                <td>₹{o.total_price}</td>
                <td>
                  <span
                    className={`badge ${
                      o.order_status === "Delivered"
                        ? "bg-success"
                        : o.order_status === "Shipped"
                        ? "bg-info text-dark"
                        : o.order_status === "Rejected"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {o.order_status}
                  </span>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={o.order_status}
                    onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                    disabled={processing === o.orderId}
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
