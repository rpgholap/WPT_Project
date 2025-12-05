import { getConnection } from "../configs/dbConfigs.js";

export async function getAllSpareParts(request, response)  {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
        SELECT 
        s.*,
        COALESCE(
          (
            SELECT i.remainingStock
            FROM inventorymanagement i
            WHERE i.sparePart_id = s.sparePart_id
            ORDER BY i.updatedAt DESC
            LIMIT 1
          ), 0
        ) AS currentStock
      FROM spareparts s
    `);
    response.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching spare parts:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSparePartById(request,response) {
  try {
    const { id } = request.params;
    const conn = await getConnection();
    const [rows] = await conn.query(`SELECT 
        s.*,
        COALESCE(
          (
            SELECT i.remainingStock
            FROM inventorymanagement i
            WHERE i.sparePart_id = s.sparePart_id
            ORDER BY i.updatedAt DESC
            LIMIT 1
          ), 0
        ) AS currentStock
      FROM spareparts s WHERE sparePart_id = ?`, [id]);

    if (rows.length === 0) {
      return response.status(404).json({ message: "Spare part not found" });
    }

    response.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching spare part by ID:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

export async function addToCart(request, response) {
  try {
    const conn = await getConnection();
    const { sparePart_id, quantity, price } = request.body;
    const user_id = request.user_id;
    const role = request.role;
    const qry =
      "SELECT orderId FROM orders WHERE user_id=? AND status='pending'";
    const [orders] = await conn.query(qry, [user_id]);
    console.log(orders);

    let orderId;
    if (orders.length === 0) {
      const [orderResult] = await conn.execute(
        "INSERT INTO orders (user_id, status, orderDate) VALUES (?, 'pending', NOW())",
        [user_id]
      );
      orderId = orderResult.insertId;
    } else {
      orderId = orders[0].orderId;
    }

    let newPrice = quantity * price;

    await conn.execute(
      `INSERT INTO orderDetails (orderId, sparePart_id, quantity, price, cartAdd, status)
       VALUES (?, ?, ?, ?, 1, 'cart')`,
      [orderId, sparePart_id, quantity, newPrice]
    );

    response.status(200).send({ message: "Item added to cart", orderId });
  } catch (err) {
    console.error(err);
    response.status(500).send({ message: "Failed to add to cart" });
  }
}

export async function buyNow(request, response) {
  const conn = await getConnection();
  try {
    const { sparePart_id, quantity, price } = request.body;
    const user_id = request.user_id;

    // 1️⃣ Create new order
    const [orderResult] = await conn.query(
      `INSERT INTO orders(user_id, orderDate, status) VALUES (?, NOW(), 'Ordered')`,
      [user_id]
    );
    const orderId = orderResult.insertId;

    // 2️⃣ Insert into order details
    const [details] = await conn.query(
      `INSERT INTO orderdetails (orderId, sparePart_id, status, quantity, price, cartAdd)
       VALUES (?, ?, 'Ordered', ?, ?, 0)`,
      [orderId, sparePart_id, quantity, price]
    );

    // 3️⃣ Fetch latest stock
    const [latestStock] = await conn.query(
      `SELECT remainingStock FROM inventorymanagement
       WHERE sparePart_id = ? ORDER BY updatedAt DESC LIMIT 1`,
      [sparePart_id]
    );

    const currentStock = latestStock.length ? latestStock[0].remainingStock : 0;

    if (currentStock < quantity) {
      return response
        .status(400)
        .json({ message: "Insufficient stock available." });
    }

    const newStock = currentStock - quantity;

    // 4️⃣ Insert stock transaction
    await conn.query(
      `INSERT INTO inventorymanagement
       (orderDetailsID, sparePart_id, transactionQuantity, remainingStock, transactionType, updatedAt)
       VALUES (?, ?, ?, ?, 'Sale', NOW())`,
      [details.insertId, sparePart_id, quantity, newStock]
    );

    response
      .status(200)
      .json({ message: "Product purchased successfully", remainingStock: newStock });
  } catch (error) {
    console.error("Error buying product:", error);
    response.status(500).json({ message: "Failed to buy product" });
  }
}

export async function editOrderDetails(request, response) {
  try {
    const conn = await getConnection();
    const { orderId, sparePart_Id } = request.params;
    const { quantity } = request.body;
    const user_id = request.user_id;

    if (!quantity || quantity <= 0)
      return response.status(400).json({ message: "Invalid quantity" });

    // 1️⃣ Get existing order details
    const [rows] = await conn.query(
      `SELECT od.orderDetailsID, od.quantity AS oldQuantity, s.price AS unitPrice
       FROM orders o
       JOIN orderdetails od ON o.orderId = od.orderId
       JOIN spareparts s ON od.sparePart_id = s.sparePart_id
       WHERE o.orderId = ? AND s.sparePart_id = ? AND o.user_id = ?`,
      [orderId, sparePart_Id, user_id]
    );

    if (rows.length === 0)
      return response
        .status(404)
        .json({ message: "Order not found or unauthorized" });

    const { orderDetailsID, oldQuantity, unitPrice } = rows[0];

    // 2️⃣ Calculate stock change
    const diff = quantity - oldQuantity; // + means user increased quantity, - means reduced

    // 3️⃣ Fetch current stock
    const [latestStock] = await conn.query(
      `SELECT remainingStock FROM inventorymanagement
       WHERE sparePart_id = ? ORDER BY updatedAt DESC LIMIT 1`,
      [sparePart_Id]
    );
    const currentStock = latestStock.length ? latestStock[0].remainingStock : 0;

    const newStock = currentStock - diff;

    if (newStock < 0) {
      return response.status(400).json({ message: "Insufficient stock to update" });
    }

    // 4️⃣ Update order details
    const newPrice = unitPrice * quantity;
    await conn.query(
      `UPDATE orderdetails SET quantity = ?, price = ? WHERE orderDetailsID = ?`,
      [quantity, newPrice, orderDetailsID]
    );

    // 5️⃣ Insert transaction record
    await conn.query(
      `INSERT INTO inventorymanagement
       (orderDetailsID, sparePart_id, transactionQuantity, remainingStock, transactionType, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        orderDetailsID,
        sparePart_Id,
        Math.abs(diff),
        newStock,
        diff > 0 ? "Sale" : "Adjustment",
      ]
    );

    response.status(200).json({
      message: "Order quantity updated successfully",
      newStock,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "Something went wrong while updating the quantity" });
  }
}

export async function viewOrderDetails(request, response) {
  try {
    const conn = await getConnection();
    const user_id = request.user_id;

    const qry = `
      SELECT
        o.orderId,
        od.orderDetailsID,
        s.sparePart_id,
        s.sparePartName,
        s.brand,
        s.modelType,
        s.price AS unitPrice,
        od.quantity,
        od.price AS totalPrice,
        o.status,
        o.orderDate
      FROM orders o
      JOIN orderdetails od ON o.orderId = od.orderId
      JOIN spareparts s ON od.sparePart_id = s.sparePart_id
      WHERE o.user_id = ?
      ORDER BY o.orderDate DESC, od.orderDetailsID DESC
    `;

    const [rows] = await conn.query(qry, [user_id]);

    response.status(200).json(rows);
  } catch (error) {
    console.error("Error in viewOrderDetails:", error);
    response.status(500).json({ message: "Something Went Wrong" });
  }
}


export async function cancelOrderById(request, response) {
  const conn = await getConnection();
  try {
    const { orderId } = request.params;
    const user_id = request.user_id;

    // 1️⃣ Verify order
    const [orders] = await conn.query(
      `SELECT o.status, od.sparePart_id, od.quantity, od.orderDetailsID
       FROM orders o
       JOIN orderdetails od ON o.orderId = od.orderId
       WHERE o.orderId = ? AND o.user_id = ?`,
      [orderId, user_id]
    );

    if (orders.length === 0)
      return response.status(404).json({ message: "Order not found or unauthorized" });

    const cancellable = ["Ordered", "Pending", "Cart"];
    if (!cancellable.includes(orders[0].status)) {
      return response
        .status(403)
        .json({ message: `Cannot cancel — current status is ${orders[0].status}` });
    }

    // 2️⃣ Update order status
    await conn.query(`UPDATE orders SET status = 'Cancelled' WHERE orderId = ?`, [orderId]);

    // 3️⃣ Fetch current stock and restock
    for (const item of orders) {
      const [latestStock] = await conn.query(
        `SELECT remainingStock FROM inventorymanagement
         WHERE sparePart_id = ? ORDER BY updatedAt DESC LIMIT 1`,
        [item.sparePart_id]
      );

      const currentStock = latestStock.length ? latestStock[0].remainingStock : 0;
      const newStock = currentStock + item.quantity;

      await conn.query(
        `INSERT INTO inventorymanagement
         (orderDetailsID, sparePart_id, transactionQuantity, remainingStock, transactionType, updatedAt)
         VALUES (?, ?, ?, ?, 'Restock', NOW())`,
        [item.orderDetailsID, item.sparePart_id, item.quantity, newStock]
      );
    }

    response.status(200).json({ message: "Order cancelled and stock updated" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error cancelling order" });
  }
}
