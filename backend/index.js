import express from "express";
import cors from "cors"
import { hashSync,compareSync } from "bcrypt";
import { connectDB, getConnection } from "./src/configs/dbConfigs.js";
import { registrations } from "./src/controllers/registrations.js";
import { loginCheck } from "./src/controllers/login.js";
import { ROLES } from "./src/constants/Roles.js";
import { authorize, verifyToken } from "./src/middlewares/VerifyTokens.js";
import { addToCart, buyNow, cancelOrderById, editOrderDetails, getAllSpareParts, getSparePartById, viewOrderDetails } from "./src/controllers/usersOperations.js";
import { getAllUsers, getAllSparePartsDetails,  getAllSuppliers, sendSparePartsRequest, getInventoryStatus, getSupplierResponses, approveSupplierResponse, requestCompleteMarked, getAllSupplierResponses, getInventorySummary, getInventoryTransactions, getAllUserOrders, updateOrderStatus } from "./src/controllers/adminOperations.js";
import { getDeliveryStatus, receivedSparePartsRequest, respondToRequest } from "./src/controllers/supplierOperations.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(request,response)=>{
    response.send({message: "Home Page"})
})

// ====================== Authentication & Authorization APIs ====================== //
app.post("/login", loginCheck); //Admin,Supplier,User
app.post("/registration", registrations); //Supplier,User

// ====================== User APIs ====================== //
app.get("/get-all-spare-parts", verifyToken, authorize([ROLES.USER]), getAllSpareParts);
app.get("/get-spare-part-by-id/:id", verifyToken, authorize([ROLES.USER]), getSparePartById);
app.get("/get-user-order-details", verifyToken, authorize([ROLES.USER]), viewOrderDetails);
app.post("/cart/add", verifyToken, authorize([ROLES.USER]), addToCart);
app.post("/orders/buy-now", verifyToken, authorize([ROLES.USER]), buyNow);
app.put("/user/edit-order/:orderId/:sparePart_Id", verifyToken, authorize([ROLES.USER]), editOrderDetails);
app.put("/user/cancel-user-order/:orderId", verifyToken, authorize([ROLES.USER]), cancelOrderById);

// ===== SUPPLIER ROUTES ===== //
app.get("/supplier/assigned-requests", verifyToken, authorize([ROLES.SUPPLIER]), receivedSparePartsRequest);
app.post("/supplier/respond-request", verifyToken, authorize([ROLES.SUPPLIER]), respondToRequest);
app.get("/supplier/delivery-status", verifyToken, authorize([ROLES.SUPPLIER]), getDeliveryStatus);

// ===== ADMIN ROUTES ===== //
app.get("/admin/get-all-users", verifyToken, authorize([ROLES.ADMIN]), getAllUsers);
app.get("/admin/user-orders", verifyToken, authorize([ROLES.ADMIN]), getAllUserOrders);
app.put("/admin/user-orders/:orderId/status", verifyToken, authorize([ROLES.ADMIN]), updateOrderStatus);
app.get("/admin/get-all-suppliers", verifyToken, authorize([ROLES.ADMIN]), getAllSuppliers);
app.get("/admin/get-all-spare-parts", verifyToken, authorize([ROLES.ADMIN]), getAllSparePartsDetails);
app.get("/admin/get-inventory-status", verifyToken, authorize([ROLES.ADMIN]), getInventoryStatus);
app.post("/admin/send-request", verifyToken, authorize([ROLES.ADMIN]), sendSparePartsRequest);
app.get("/admin/get-supplier-responses", verifyToken, authorize([ROLES.ADMIN]), getSupplierResponses);
app.put("/admin/approve-response/:response_id", verifyToken, authorize([ROLES.ADMIN]), approveSupplierResponse);
app.put("/admin/request-complete/:id", verifyToken, authorize([ROLES.ADMIN]), requestCompleteMarked);
app.get("/admin/get-all-responses", verifyToken, authorize([ROLES.ADMIN]), getAllSupplierResponses);
app.get("/admin/inventory", verifyToken, authorize([ROLES.ADMIN]), getInventorySummary);
app.get("/admin/inventory-history", verifyToken, authorize([ROLES.ADMIN]), getInventoryTransactions);


app.get("/password-generate/:password",(request,response)=>{
        const encryptedPassword = hashSync(request.params.password, 12);
        console.log(encryptedPassword);
});

app.listen(3200,()=>{
    connectDB();
    console.log("Server Listen on 3200 Port");
})