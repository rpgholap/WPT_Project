import { useEffect, useState } from "react";
import { Table, Button, Spinner, Form } from "react-bootstrap";
import { getDeliveryStatus } from "../../../../services/SupplierServices";

export function DeliveryStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getDeliveryStatus();
      console.log(res)
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h5 className="mb-4 text-danger fw-bold">Delivery Status</h5>
      {data.length === 0 ? (
        <p className="text-center text-muted">No completed deliveries yet.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-danger">
            <tr>
              <th>#</th>
              <th>Spare Part</th>
              <th>Requested Qty</th>
              <th>Fulfilled Qty</th>
              <th>Status</th>
              <th>Fulfilled On</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.request_id}>
                <td>{i + 1}</td>
                <td>{d.sparePartName}</td>
                <td>{d.requested_quantity}</td>
                <td>{d.fulfilled_quantity}</td>
                <td><span className="badge bg-success">{d.status}</span></td>
                <td>{new Date(d.fulfilled_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}