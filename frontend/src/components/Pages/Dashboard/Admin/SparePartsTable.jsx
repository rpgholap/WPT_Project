import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { getAllSpareParts } from "../../../../services/AdminServices";

export function SparePartsTable() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSpareParts().then(res => {
      setParts(res.data);
      console.log(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Table striped bordered hover responsive>
      <thead className="table-danger">
        <tr>
          <th>#</th><th>Part Name</th><th>Brand</th><th>Model</th><th>Price</th><th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {parts.map((p, i) => (
          <tr key={p.sparePart_id}>
            <td>{i + 1}</td><td>{p.sparePartName}</td><td>{p.brand}</td>
            <td>{p.modelType}</td><td>₹{Number(p.price).toFixed(2)}</td>
            <td>{p.quantityInStock}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}