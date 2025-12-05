import { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import { getAssignedRequests, respondToRequest } from "../../../../services/SupplierServices";
import { toast } from "react-toastify";

export function AssignedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({ quantity: "", response_message: "" });

  const loadRequests = async () => {
    try {
      const res = await getAssignedRequests();
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleShow = (req) => {
    setSelectedRequest(req);
    setFormData({ quantity: "", response_message: "" });
    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quantity = parseInt(formData.quantity);
    const requested = parseInt(selectedRequest.requested_quantity);

    if (quantity <= 0) {
      toast.warning("Please enter a valid quantity greater than 0");
      return;
    }

    if (quantity > requested) {
      toast.error(`Cannot fulfill more than ${requested} items!`);
      return;
    }

    try {
      await respondToRequest({
        request_id: selectedRequest.request_id,
        sparePart_id: selectedRequest.sparePart_id,
        quantity,
        response_message: formData.response_message,
      });

      toast.success("Response sent successfully!");
      setShow(false);
      loadRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send response");
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Table striped bordered hover responsive>
        <thead className="table-danger">
          <tr>
            <th>#</th>
            <th>Request ID</th>
            <th>Spare Part</th>
            <th>Requested Qty</th>
            <th>Remarks</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, i) => (
            <tr key={r.request_id}>
              <td>{i + 1}</td>
              <td>{r.request_id}</td>
              <td>{r.sparePartName}</td>
              <td>{r.requested_quantity}</td>
              <td>{r.remarks || "-"}</td>
              <td>
                <span
                  className={`badge ${
                    r.status === "Pending"
                      ? "bg-warning text-dark"
                      : r.status === "Approved"
                      ? "bg-success"
                      : r.status === "Completed"
                      ? "bg-info"
                      : "bg-secondary"
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td>
                {r.status === "Pending" ? (
                  <Button variant="outline-primary" size="sm" onClick={() => handleShow(r)}>
                    Respond
                  </Button>
                ) : (
                  <span className="text-muted">Responded</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Response Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Respond to Request #{selectedRequest?.request_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Quantity to Fulfill</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantity}
                max={selectedRequest?.requested_quantity || ""}
                min={1}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Response Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.response_message}
                onChange={(e) =>
                  setFormData({ ...formData, response_message: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100">
              Send Response
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}