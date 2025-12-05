import { useState, useEffect } from "react";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { getAllSuppliers, getAllSpareParts, sendSparePartsRequest } from "../../../../services/AdminServices";
import { toast } from "react-toastify";

export function RequestsForm() {
  const [show, setShow] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [parts, setParts] = useState([]);
  const [formData, setFormData] = useState({
    sparePart_id: "",
    supplier_id: "",
    requested_quantity: "",
    remarks: "",
    expected_delivery_date: "",
  });

  useEffect(() => {
    getAllSuppliers().then(res => setSuppliers(res.data));
    getAllSpareParts().then(res => setParts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendSparePartsRequest(formData);
      console.log(res)
      toast.success("Request sent successfully!");
      setShow(false);
      setFormData({
        sparePart_id: "", supplier_id: "", requested_quantity: "", remarks: "", expected_delivery_date: "",
      });
    } catch (err) {
      toast.error("Failed to send request");
      console.error(err);
    }
  };

  return (
    <>
      <Button variant="danger" className="mb-3" onClick={() => setShow(true)}>
        + Send Spare Part Request
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Spare Part Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Select name="sparePart_id" className="mb-3" value={formData.sparePart_id} onChange={(e) => setFormData({...formData, sparePart_id: e.target.value})} required>
              <option value="">Select Spare Part</option>
              {parts.map(p => <option key={p.sparePart_id} value={p.sparePart_id}>{p.sparePartName}</option>)}
            </Form.Select>

            <Form.Select name="supplier_id" className="mb-3" value={formData.supplier_id} onChange={(e) => setFormData({...formData, supplier_id: e.target.value})} required>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
            </Form.Select>

            <Form.Control
              type="number"
              name="requested_quantity"
              className="mb-3"
              placeholder="Requested Quantity"
              value={formData.requested_quantity}
              onChange={(e) => setFormData({...formData, requested_quantity: e.target.value})}
              required
            />
            <Form.Control
              type="date"
              name="expected_delivery_date"
              className="mb-3"
              value={formData.expected_delivery_date}
              onChange={(e) => setFormData({...formData, expected_delivery_date: e.target.value})}
              required
            />
            <Form.Control
              as="textarea"
              rows={3}
              name="remarks"
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            />
            <Button variant="danger" type="submit" className="mt-3 w-100">Send Request</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
