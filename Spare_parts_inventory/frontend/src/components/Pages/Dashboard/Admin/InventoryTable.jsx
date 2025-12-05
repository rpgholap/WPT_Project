import { useEffect, useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import { getInventorySummary, getInventoryTransactions } from "../../../../services/AdminServices";
import { toast } from "react-toastify";

export function InventoryTable() {
  const [summary, setSummary] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, historyRes] = await Promise.all([
        getInventorySummary(),
        getInventoryTransactions(),
      ]);
      setSummary(summaryRes.data || []);
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error loading inventory data");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-danger mb-0">
          {viewHistory ? "Inventory Transactions" : "Inventory Stock Summary"}
        </h4>
        <Button
          variant={viewHistory ? "outline-danger" : "danger"}
          onClick={() => setViewHistory(!viewHistory)}
        >
          {viewHistory ? "Back to Stock Summary" : "View Transactions"}
        </Button>
      </div>

      {/* 🧾 Stock Summary View */}
      {!viewHistory ? (
        <Table bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>#</th>
              <th>Spare Part</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Price</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {summary.length > 0 ? (
              summary.map((s, i) => (
                <tr key={s.sparePart_id}>
                  <td>{i + 1}</td>
                  <td>{s.sparePartName}</td>
                  <td>{s.brand || "-"}</td>
                  <td>{s.modelType || "-"}</td>
                  <td>₹{Number(s.price).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.currentStock === 0
                          ? "bg-danger"
                          : s.currentStock < 10
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {s.currentStock}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No stock data available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        // 📦 Transaction History View
        <Table bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>#</th>
              <th>Part Name</th>
              <th>Transaction Type</th>
              <th>Quantity</th>
              <th>Remaining Stock</th>
              <th>Supplier</th>
              <th>Admin</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((h, i) => (
                <tr key={h.transactionID}>
                  <td>{i + 1}</td>
                  <td>{h.sparePartName}</td>
                  <td>
                    <span
                      className={`badge ${
                        h.transactionType === "Restock"
                          ? "bg-success"
                          : h.transactionType === "UserOrder"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {h.transactionType}
                    </span>
                  </td>
                  <td>{h.transactionQuantity}</td>
                  <td>{h.remainingStock}</td>
                  <td>{h.supplier_name || "—"}</td>
                  <td>{h.admin_name || "—"}</td>
                  <td>{new Date(h.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No transaction history available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}