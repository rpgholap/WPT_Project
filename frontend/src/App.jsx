import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layouts/Layout";
import { Home } from "./components/Pages/Home";
import { About } from "./components/Pages/About";
import { Contact } from "./components/Pages/Contact";
import { PartDetail } from "./components/Pages/PartDetail";
import { PartsList } from "./components/Pages/PartList";
import { Login } from "./components/Pages/Login";
import { Register } from "./components/Pages/Registration";
import { ToastContainer } from "react-toastify";
import { ROLES } from "./constants/RoleConstant";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminDashboard } from "./components/Pages/Dashboard/Admin/AdminDashboard";
import { SupplierDashboard } from "./components/Pages/Dashboard/Supplier/SupplierDashboard";
import { UserOrders } from "./components/Pages/UserOrders";


function App() {
  return (
    <>
      <Routes>
        {/* Common layout with navbar + footer */}
        <Route path="/" element={<Layout />}>
          {/* Public routes (accessible to everyone) */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Role-protected routes */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.USER]} />}>
            <Route path="parts" element={<PartsList />} />
            <Route path="parts/:id" element={<PartDetail />} />
            <Route path="/orders" element={<UserOrders />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="dashboard/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[ROLES.SUPPLIER]} />}>
            <Route path="dashboard/supplier" element={<SupplierDashboard />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;