import { getConnection } from "../configs/dbConfigs.js";

export async function receivedSparePartsRequest(req, res) {
  try {
    const supplier_id = req.user_id;
    const conn = await getConnection();

    const [rows] = await conn.query(
      `
      SELECT 
        r.request_id, r.sparePart_id, sp.sparePartName,
        r.requested_quantity, r.fulfilled_quantity,
        r.status, r.remarks, r.expected_delivery_date,
        r.request_date
      FROM requests r
      JOIN spareparts sp ON r.sparePart_id = sp.sparePart_id
      WHERE r.supplier_id = ? 
      AND r.status IN ('Pending', 'Responded', 'In-Transit', 'Partial-Fulfilled')
      ORDER BY r.request_date DESC
      `,
      [supplier_id]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assigned requests" });
  }
}

// export async function respondToRequest(req, res) {
//   try {
//     const conn = await getConnection();
//     const supplier_id = req.user_id;
//     const { request_id, fulfilled_quantity, response_message } = req.body;

//     const [reqData] = await conn.query(
//       "SELECT requested_quantity, status FROM requests WHERE request_id = ? AND supplier_id = ?",
//       [request_id, supplier_id]
//     );

//     if (!reqData.length)
//       return res.status(404).json({ message: "Request not found" });

//     const data = reqData[0];

//     if (data.status === "Completed")
//       return res.status(400).json({ message: "Request already completed" });

//     const qty = parseInt(fulfilled_quantity || 0);
//     if (qty < 0)
//       return res.status(400).json({ message: "Invalid fulfilled quantity" });

//     if (qty > data.requested_quantity)
//       return res
//         .status(400)
//         .json({ message: "Cannot exceed requested quantity" });

//     await conn.query(
//       `
//       UPDATE requests
//       SET fulfilled_quantity = ?, remarks = ?, response_date = NOW(), status = 'Responded'
//       WHERE request_id = ? AND supplier_id = ?
//       `,
//       [qty, response_message, request_id, supplier_id]
//     );

//     res.status(200).json({ message: "Response sent successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error responding to request" });
//   }
// }

export async function respondToRequest(request, response) {
  try {
    const conn = await getConnection();
    const supplier_id = request.user_id;
    const { request_id, sparePart_id, quantity, response_message } = request.body;

    // Get existing request data
    const [existing] = await conn.query(
      "SELECT requested_quantity, fulfilled_quantity, status FROM requests WHERE request_id = ? AND supplier_id = ?",
      [request_id, supplier_id]
    );

    if (!existing.length)
      return response.status(404).json({ message: "Request not found" });

    const { requested_quantity, fulfilled_quantity = 0 } = existing[0];
    const totalFulfilled = fulfilled_quantity + quantity;

    if (totalFulfilled > requested_quantity) {
      return response
        .status(400)
        .json({ message: "Fulfilled quantity exceeds requested quantity" });
    }

    // Determine new status
    let newStatus = "Pending";
    if (totalFulfilled === requested_quantity) {
      newStatus = "Responded";
    } else if (totalFulfilled >= requested_quantity * 0.5) {
      newStatus = "Partial-Fulfilled";
    } else if (totalFulfilled >= requested_quantity * 0.1) {
      newStatus = "In-Transit";
    }

    await conn.query(
      `UPDATE requests 
       SET fulfilled_quantity = ?, remarks = ?, status = ?, response_date = NOW()
       WHERE request_id = ? AND supplier_id = ?`,
      [totalFulfilled, response_message, newStatus, request_id, supplier_id]
    );

    response.status(200).send({
      message: "Response submitted successfully",
      status: newStatus,
      fulfilled_quantity: totalFulfilled,
    });
  } catch (error) {
    console.error("Error responding to request:", error);
    response.status(500).send({ message: "Error responding to request" });
  }
}


export async function getDeliveryStatus(req, res) {
  try {
    const supplier_id = req.user_id;
    const conn = await getConnection();

    const [rows] = await conn.query(
      `
      SELECT 
        r.request_id, sp.sparePartName,
        r.requested_quantity, r.fulfilled_quantity,
        r.status, r.remarks, r.fulfilled_date
      FROM requests r
      JOIN spareparts sp ON r.sparePart_id = sp.sparePart_id
      WHERE r.supplier_id = ? 
      AND r.status = 'Completed'
      ORDER BY r.fulfilled_date DESC
      `,
      [supplier_id]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching delivery status" });
  }
}
