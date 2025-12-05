import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { getAllUsers } from "../../../../services/AdminServices";

export function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Table striped bordered hover responsive>
      <thead className="table-danger">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>City</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={u.user_id}>
            <td>{i + 1}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.phone}</td>
            <td>{u.city}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}