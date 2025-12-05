import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { getAssignedRequests } from "../../../../services/SupplierServices";

export function MyResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignedRequests().then((res) => {
      // show only non-pending (responded/approved/completed)
      const filtered = res.data.filter(
        (r) => r.status !== "Pending"
      );
      setResponses(filtered);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Table striped bordered hover responsive>
      <thead className="table-danger">
        <tr>
          <th>#</th>
          <th>Request ID</th>
          <th>Spare Part</th>
          <th>Qty</th>
          <th>Status</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {responses.map((r, i) => (
          <tr key={r.request_id}>
            <td>{i + 1}</td>
            <td>{r.request_id}</td>
            <td>{r.sparePartName}</td>
            <td>{r.requested_quantity}</td>
            <td>{r.status}</td>
            <td>{r.remarks || "-"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}