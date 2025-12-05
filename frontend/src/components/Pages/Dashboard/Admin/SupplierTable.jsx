import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { getAllSuppliers } from "../../../../services/AdminServices";

export function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSuppliers().then(res => {
      setSuppliers(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Table striped bordered hover responsive>
      <thead className="table-danger">
        <tr>
          <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>State</th><th>City</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((s, i) => (
          <tr key={s.supplier_id}>
            <td>{i + 1}</td><td>{s.supplier_name}</td><td>{s.email}</td>
            <td>{s.phone}</td><td>{s.state}</td><td>{s.city}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}