import { getConnection } from "../configs/dbConfigs.js";

export async function getAllUsers(request, response) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT * FROM users WHERE role_id = 3");
    if (!rows.length) return response.status(404).send({ message: "No users found" });
    response.status(200).send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error fetching users" });
  }
}

export async function getAllUserOrders(req, res) {
  try {
    const conn = await getConnection();

    const [rows] = await conn.query(`
      SELECT 
        o.orderId,
        o.user_id,
        u.name AS user_name,
        u.email AS user_email,
        o.orderDate,
        o.status AS order_status,
        od.orderDetailsID,
        od.quantity,
        od.price AS total_price,
        s.sparePartName,
        s.brand,
        s.modelType,
        s.price AS unit_price
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN orderdetails od ON o.orderId = od.orderId
      JOIN spareparts s ON od.sparePart_id = s.sparePart_id
      ORDER BY o.orderDate DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching all user orders:", error);
    res.status(500).json({ message: "Error fetching user orders" });
  }
}

export async function getAllSupplierResponses(request, response) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT 
        r.request_id,
        r.sparePart_id,
        r.supplier_id,
        s.sparePartName,
        sup.supplier_name,
        r.requested_quantity,
        r.fulfilled_quantity,
        r.status,
        r.remarks,
        r.expected_delivery_date,
        r.response_date
      FROM requests r
      JOIN spareparts s ON r.sparePart_id = s.sparePart_id
      JOIN suppliers sup ON r.supplier_id = sup.supplier_id
      ORDER BY r.request_date DESC
    `);
    response.status(200).send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error fetching responses" });
  }
}

export async function getAllSuppliers(request, response) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT * FROM suppliers ORDER BY supplier_name ASC");
    if (!rows.length) return response.status(404).send({ message: "No suppliers found" });
    response.status(200).send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error fetching suppliers" });
  }
}

export async function getAllSparePartsDetails(request, response) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT 
        s.sparePart_id,
        s.sparePartName,
        s.brand,
        s.modelType,
        s.category,
        s.quantityInStock,
        s.price,
        sp.supplier_name
      FROM spareparts s
      LEFT JOIN suppliers sp ON s.supplier_id = sp.supplier_id
      ORDER BY s.sparePartName ASC
    `);
    response.status(200).send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error fetching spare parts" });
  }
}

export async function getInventoryStatus(request, response) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT 
        i.transactionID,
        s.sparePartName,
        i.transactionQuantity,
        i.remainingStock,
        i.transactionType,
        i.updatedAt
      FROM inventorymanagement i
      JOIN spareparts s ON i.sparePart_id = s.sparePart_id
      ORDER BY i.updatedAt DESC
    `);
    response.status(200).send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error fetching inventory data" });
  }
}

export async function sendSparePartsRequest(request, response) {
  try {
    const conn = await getConnection();
    const { sparePart_id, supplier_id, requested_quantity, remarks, expected_delivery_date } = request.body;
    const admin_id = request.user_id;

    await conn.query(`
      INSERT INTO requests 
      (sparePart_id, supplier_id, admin_id, requested_quantity, remarks, expected_delivery_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `, [sparePart_id, supplier_id, admin_id, requested_quantity, remarks, expected_delivery_date]);

    response.status(201).send({ message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error sending request" });
  }
}

export async function getSupplierResponses(request, response) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT 
        r.response_id,
        r.request_id,
        s.supplier_name,
        sp.sparePartName,
        r.quantity,
        r.status,
        r.response_message,
        r.created_at
      FROM supplier_responses r
      JOIN suppliers s ON r.supplier_id = s.supplier_id
      JOIN spareparts sp ON r.sparePart_id = sp.sparePart_id
      ORDER BY r.created_at DESC
    `);
    response.status(200).send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error fetching responses" });
  }
}

export async function approveSupplierResponse(request, response) {
  try {
    const conn = await getConnection();
    const { response_id } = request.params;
    console.log(response_id)
    const [rows] = await conn.query(`
      SELECT * FROM supplier_responses WHERE response_id = ?`, [response_id]
    );

    if (!rows.length) return response.status(404).send({ message: "Response not found" });

    const { sparePart_id, quantity, supplier_id, request_id } = rows[0];
    console.log(sparePart_id, quantity, supplier_id, request_id);
    const admin_id = request.user_id;

    // 1️⃣ Approve response
    await conn.query("UPDATE supplier_responses SET status = 'Approved' WHERE response_id = ?", [response_id]);
    await conn.query("UPDATE requests SET status = 'Approved', fulfilled_quantity = ?, fulfilled_date = NOW() WHERE request_id = ?", [quantity, request_id]);

    // 2️⃣ Update stock
    await conn.query(`
      UPDATE spareparts
      SET quantityInStock = quantityInStock + ?
      WHERE sparePart_id = ?
    `, [quantity, sparePart_id]);

    // 3️⃣ Record inventory update
    const [stock] = await conn.query(`SELECT quantityInStock FROM spareparts WHERE sparePart_id = ?`, [sparePart_id]);
    const remainingStock = stock[0]?.quantityInStock || 0;

    await conn.query(`
      INSERT INTO inventorymanagement
      (orderDetailsID, sparePart_id, transactionQuantity, admin_id, supplier_id, remainingStock, transactionType, updatedAt)
      VALUES (NULL, ?, ?, ?, ?, ?, 'Restock', NOW())
    `, [sparePart_id, quantity, admin_id, supplier_id, remainingStock]);

    response.status(200).send({ message: "Response approved and stock updated" });
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Error approving response" });
  }
}

// export async function requestCompleteMarked(req, res) {
//   try {
//     const { id } = req.params;
//     const { fulfilled_quantity } = req.body;

//     const connection = await getConnection();

//     // Fetch the existing request
//     const [reqData] = await connection.query(
//       `SELECT * FROM requests WHERE request_id = ?`,
//       [id]
//     );

//     if (!reqData.length)
//       return res.status(404).json({ message: "Request not found" });

//     const request = reqData[0];
//     const requestedQty = parseInt(request.requested_quantity || 0);
//     const fulfilledQty = parseInt(fulfilled_quantity || 0);

//     // Validate numbers
//     if (isNaN(fulfilledQty) || fulfilledQty < 0) {
//       return res.status(400).json({ message: "Invalid fulfilled quantity" });
//     }

//     // Determine status
//     let newStatus = "Pending";
//     if (fulfilledQty === requestedQty) newStatus = "Completed";
//     else if (fulfilledQty >= requestedQty * 0.5) newStatus = "Partial-Fulfilled";
//     else if (fulfilledQty >= requestedQty * 0.1) newStatus = "In-Transit";

//     // Update request table
//     await connection.query(
//       `
//       UPDATE requests
//       SET fulfilled_quantity = ?, status = ?, fulfilled_date = NOW()
//       WHERE request_id = ?
//       `,
//       [fulfilledQty, newStatus, id]
//     );

//     // Update inventory only when fully completed
//     if (newStatus === "Completed") {
//       // get last stock
//       const [lastStock] = await connection.query(
//         `SELECT remainingStock FROM inventorymanagement
//          WHERE sparePart_id = ? ORDER BY updatedAt DESC LIMIT 1`,
//         [request.sparePart_id]
//       );
//       const currentStock = lastStock.length ? lastStock[0].remainingStock : 0;
//       const newStock = currentStock + fulfilledQty;

//       await connection.query(
//         `INSERT INTO inventorymanagement
//          (orderDetailsID, sparePart_id, transactionQuantity, admin_id, supplier_id,
//           remainingStock, transactionType, updatedAt)
//          VALUES (NULL, ?, ?, ?, ?, ?, 'Restock', NOW())`,
//         [
//           request.sparePart_id,
//           fulfilledQty,
//           request.admin_id,
//           request.supplier_id,
//           newStock,
//         ]
//       );
//     }

//     res.status(200).json({
//       message:
//         newStatus === "Completed"
//           ? "Request marked completed and stock updated"
//           : `Request marked as ${newStatus}`,
//       status: newStatus,
//     });
//   } catch (err) {
//     console.error("Error completing request:", err);
//     res.status(500).json({ message: "Error completing request" });
//   }
// }

export async function requestCompleteMarked(req, res) {
  try {
    const { id } = req.params;

    const connection = await getConnection();
    const [reqData] = await connection.query(
      "SELECT * FROM requests WHERE request_id = ?",
      [id]
    );

    if (!reqData.length)
      return res.status(404).json({ message: "Request not found" });

    const request = reqData[0];

    // Only fully fulfilled requests can be marked complete
    if (request.fulfilled_quantity < request.requested_quantity) {
      return res.status(400).json({
        message: "Cannot mark as complete — request not fully fulfilled yet",
      });
    }

    // ✅ Mark completed
    await connection.query(
      `UPDATE requests 
       SET status = 'Completed', fulfilled_date = NOW()
       WHERE request_id = ?`,
      [id]
    );

    // ✅ Update inventory
    const [lastStock] = await connection.query(
      `SELECT remainingStock 
       FROM inventorymanagement 
       WHERE sparePart_id = ? 
       ORDER BY updatedAt DESC LIMIT 1`,
      [request.sparePart_id]
    );

    const currentStock = lastStock.length ? lastStock[0].remainingStock : 0;
    const newStock = currentStock + request.fulfilled_quantity;

    await connection.query(
      `INSERT INTO inventorymanagement 
       (orderDetailsID, sparePart_id, transactionQuantity, remainingStock, transactionType, updatedAt, admin_id, supplier_id)
       VALUES (NULL, ?, ?, ?, 'Restock', NOW(), ?, ?)`,
      [request.sparePart_id, request.fulfilled_quantity, newStock, request.admin_id, request.supplier_id]
    );

    res.json({
      message: "Request marked completed and inventory updated successfully",
      newStock,
    });
  } catch (err) {
    console.error("Error completing request:", err);
    res.status(500).json({ message: "Error completing request" });
  }
}

export async function getInventoryTransactions(req, res) {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query(`
      SELECT 
        i.transactionID,
        s.sparePartName,
        i.transactionQuantity,
        i.remainingStock,
        i.transactionType,
        i.updatedAt,
        sup.supplier_name,
        a.admin_name
      FROM inventorymanagement i
      JOIN spareparts s ON i.sparePart_id = s.sparePart_id
      LEFT JOIN suppliers sup ON i.supplier_id = sup.supplier_id
      LEFT JOIN admin a ON i.admin_id = a.admin_id
      ORDER BY i.updatedAt DESC
    `);

    if(rows.length === 0) {
      res.status(400).send({message:"Data Not Found"});
    } else {
      console.log(1, rows);
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error("Error fetching inventory transactions:", err);
    res.status(500).json({ message: "Error fetching inventory transactions" });
  }
}

export async function getInventorySummary(req, res) {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query(`
      SELECT 
        s.sparePart_id,
        s.sparePartName,
        s.brand,
        s.modelType,
        s.price,
        COALESCE((
          SELECT remainingStock
          FROM inventorymanagement i
          WHERE i.sparePart_id = s.sparePart_id
          ORDER BY i.updatedAt DESC
          LIMIT 1
        ), s.quantityInStock, 0) AS currentStock
      FROM spareparts s
      ORDER BY s.sparePartName ASC
    `);

    if(rows.length === 0) {
      res.status(400).send({message:"Data Not Found"});
    } else {
      console.log(2, rows);
      res.status(200).json(rows);
    }

  } catch (err) {
    console.error("Error fetching inventory summary:", err);
    res.status(500).json({ message: "Error fetching inventory summary" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const conn = await getConnection();
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Ordered", "Shipped", "Delivered", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const [result] = await conn.query(
      "UPDATE orders SET status = ? WHERE orderId = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: `Order status updated to ${status}` });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
}