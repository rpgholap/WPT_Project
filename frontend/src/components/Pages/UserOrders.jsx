import { useEffect, useState } from "react";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  viewOrderDetails,
  cancelOrder,
  editOrder,
  buyNow,
} from "../../services/UserOrderServices";

export function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newQty, setNewQty] = useState({});
  const [processing, setProcessing] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await viewOrderDetails();
      const data = (res.data || []).map(o => ({
        ...o,
        orderDetailsID: o.orderDetailsID,
        sparePart_id: o.sparePart_id,
        totalPrice: parseFloat(o.totalPrice || 0),
        unitPrice: parseFloat(o.unitPrice || 0)
      }));
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Order
  const handleSave = async (o) => {
    const qty = parseInt(newQty[o.orderDetailsID], 10);
    if (!qty || qty <= 0) return toast.warning("Enter valid quantity");

    try {
      setProcessing(o.orderDetailsID);
      await editOrder(o.orderId, o.sparePart_id, { quantity: qty });
      toast.success("Order updated successfully");
      setEditingId(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Cancel Order
  const handleCancel = async (o) => {
    try {
      setProcessing(o.orderId);
      await cancelOrder(o.orderId);
      toast.success("Order cancelled");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Cancel failed");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Buy Now from Cart
  const handleBuyNow = async (o) => {
    try {
      setProcessing(o.orderId);
      await buyNow({
        sparePart_id: o.sparePart_id,
        quantity: o.quantity,
        price: o.unitPrice
      });
      toast.success("Order placed successfully");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h4 className="text-danger fw-bold mb-4">My Orders</h4>
      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-danger">
            <tr>
              <th>#</th>
              <th>Spare Part</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o.orderDetailsID}>
                <td>{idx + 1}</td>
                <td>{o.sparePartName}</td>
                <td>{o.brand}</td>
                <td>{o.modelType}</td>
                <td>
                  {editingId === o.orderDetailsID ? (
                    <Form.Control
                      type="number"
                      min="1"
                      value={newQty[o.orderDetailsID] || o.quantity}
                      onChange={(e) =>
                        setNewQty({ ...newQty, [o.orderDetailsID]: e.target.value })
                      }
                      style={{ width: "80px" }}
                    />
                  ) : (
                    o.quantity
                  )}
                </td>
                <td>₹{o.unitPrice.toFixed(2)}</td>
                <td>₹{(o.unitPrice * o.quantity).toFixed(2)}</td>
                <td>
                  <span className={`badge ${
                    o.status === "Ordered" ? "bg-primary"
                    : o.status === "Cancelled" ? "bg-danger"
                    : "bg-secondary"
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td>
                  {editingId === o.orderDetailsID ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSave(o)}
                      disabled={processing === o.orderDetailsID}
                    >
                      {processing === o.orderDetailsID ? <Spinner size="sm" /> : "Save"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setEditingId(o.orderDetailsID)}
                      disabled={o.status.toLowerCase() !== "ordered"}
                    >
                      Edit
                    </Button>
                  )}
                  {" "}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancel(o)}
                    disabled={processing === o.orderId}
                  >
                    Cancel
                  </Button>
                  {" "}
                  {o.status.toLowerCase() === "cart" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleBuyNow(o)}
                      disabled={processing === o.orderId}
                    >
                      Buy Now
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}