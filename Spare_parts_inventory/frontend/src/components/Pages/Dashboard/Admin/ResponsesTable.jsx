import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllResponses,
  completeRequest,
  sendSparePartsRequest,
} from "../../../../services/AdminServices";

// export function ResponsesTable() {
//   const [responses, setResponses] = useState([]);
//   const [processing, setProcessing] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { load(); }, []);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllResponses();
//       setResponses(res.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load responses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markComplete = async (req) => {
//     try {
//       setProcessing(req.request_id);
//       const res = await completeRequest(req.request_id, {
//         fulfilled_quantity: req.fulfilled_quantity,
//       });
//       toast.success(res.data.message);
//       setResponses((prev) =>
//         prev.map((r) =>
//           r.request_id === req.request_id
//             ? { ...r, status: res.data.status }
//             : r
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       toast.error("Error updating request");
//     } finally {
//       setProcessing(null);
//     }
//   };

//   if (loading)
//     return <div className="text-center p-5"><Spinner animation="border" variant="danger" /></div>;

//   return (
//     <div className="p-4 bg-white shadow rounded">
//       <h4 className="text-danger fw-bold mb-4">Supplier Responses</h4>
//       <Table bordered hover responsive>
//         <thead className="table-danger">
//           <tr>
//             <th>#</th><th>Part</th><th>Supplier</th><th>Requested</th>
//             <th>Fulfilled</th><th>Status</th><th>Remarks</th><th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {responses.map((r, i) => (
//             <tr key={r.request_id}>
//               <td>{i + 1}</td>
//               <td>{r.sparePartName}</td>
//               <td>{r.supplier_name}</td>
//               <td>{r.requested_quantity}</td>
//               <td>{r.fulfilled_quantity}</td>
//               <td>
//                 <span
//                   className={`badge ${
//                     r.status === "Completed"
//                       ? "bg-success"
//                       : r.status === "Partial-Fulfilled"
//                       ? "bg-warning text-dark"
//                       : r.status === "In-Transit"
//                       ? "bg-info text-dark"
//                       : "bg-secondary"
//                   }`}
//                 >
//                   {r.status}
//                 </span>
//               </td>
//               <td>{r.remarks || "-"}</td>
//               <td>
//                 {r.status !== "Completed" ? (
//                   <Button
//                     variant="success"
//                     size="sm"
//                     disabled={processing === r.request_id}
//                     onClick={() => markComplete(r)}
//                   >
//                     {processing === r.request_id ? (
//                       <Spinner size="sm" animation="border" />
//                     ) : (
//                       "Mark Completed"
//                     )}
//                   </Button>
//                 ) : (
//                   <Button variant="outline-secondary" size="sm" disabled>
//                     Completed
//                   </Button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// }

export function ResponsesTable() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadResponses();
  }, []);

  // ✅ Fetch all supplier responses
  const loadResponses = async () => {
    try {
      setLoading(true);
      const res = await getAllResponses();
      setResponses(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch supplier responses");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark Request as Completed
  const handleComplete = async (id, qty) => {
    try {
      setProcessing(id);
      const res = await completeRequest(id, { fulfilled_quantity: qty });
      toast.success(res.data.message || "Request marked as completed");
      loadResponses();
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.warning(error.response.data.message);
      } else {
        toast.error("Error marking as completed");
      }
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Send Re-Request for Remaining Quantity
  const handleReRequest = async (r) => {
    try {
      const remainingQty = r.requested_quantity - r.fulfilled_quantity;

      if (remainingQty <= 0) {
        toast.info("No remaining quantity to request");
        return;
      }

      await sendSparePartsRequest({
        sparePart_id: r.sparePart_id,
        supplier_id: r.supplier_id,
        requested_quantity: remainingQty,
        remarks: `Re-requested remaining ${remainingQty} units`,
        expected_delivery_date: new Date().toISOString().split("T")[0],
      });

      toast.success(`Re-request for ${remainingQty} units sent successfully`);
      loadResponses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send re-request");
    }
  };

  // ✅ Disable re-request if a newer fulfilled request exists for same supplier/part
  const hasNewFulfilledRequest = (r) => {
    return responses.some(
      (res) =>
        res.supplier_id === r.supplier_id &&
        res.sparePart_id === r.sparePart_id &&
        res.request_id !== r.request_id &&
        res.fulfilled_quantity > 0 &&
        res.status !== "Pending"
    );
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  return (
    <div className="p-4 bg-white shadow rounded">
      <h4 className="mb-4 text-danger fw-bold">Supplier Responses</h4>

      {responses.length === 0 ? (
        <p className="text-center text-muted">
          No supplier responses available.
        </p>
      ) : (
        <Table bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>#</th>
              <th>Spare Part</th>
              <th>Supplier</th>
              <th>Requested Qty</th>
              <th>Fulfilled Qty</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {responses.map((r, index) => {
              const remainingQty = r.requested_quantity - r.fulfilled_quantity;
              const reRequested = hasNewFulfilledRequest(r);

              return (
                <tr key={r.request_id}>
                  <td>{index + 1}</td>
                  <td>{r.sparePartName}</td>
                  <td>{r.supplier_name || "N/A"}</td>
                  <td>{r.requested_quantity}</td>
                  <td>{r.fulfilled_quantity}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "Completed"
                          ? "bg-success"
                          : r.status === "Partial-Fulfilled"
                          ? "bg-warning text-dark"
                          : r.status === "In-Transit"
                          ? "bg-info text-dark"
                          : r.status === "Responded"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{r.remarks || "-"}</td>
                  <td>
                    {/* ✅ Mark as Completed only if fully fulfilled */}
                    {r.fulfilled_quantity === r.requested_quantity &&
                    r.status !== "Completed" ? (
                      <Button
                        variant="success"
                        size="sm"
                        className="fw-semibold"
                        onClick={() =>
                          handleComplete(r.request_id, r.fulfilled_quantity)
                        }
                        disabled={processing === r.request_id}
                      >
                        {processing === r.request_id ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{" "}
                            Updating...
                          </>
                        ) : (
                          "Mark Completed"
                        )}
                      </Button>
                    ) : r.status !== "Completed" ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          reRequested ? (
                            <Tooltip id={`tooltip-${r.request_id}`}>
                              Already re-requested to supplier
                            </Tooltip>
                          ) : (
                            <span /> // ✅ Return an empty span, not <>
                          )
                        }
                      >
                        <span>
                          <Button
                            variant={reRequested ? "outline-info" : "warning"}
                            size="sm"
                            className="fw-semibold"
                            onClick={() => handleReRequest(r)}
                            disabled={
                              processing === r.request_id || reRequested
                            }
                          >
                            {reRequested
                              ? "Re-Requested"
                              : `Re-Request (${remainingQty})`}
                          </Button>
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <Button variant="outline-secondary" size="sm" disabled>
                        Completed
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
