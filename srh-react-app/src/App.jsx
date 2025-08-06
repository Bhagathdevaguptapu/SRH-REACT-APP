import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Admin_login from "./app/admin/admin-login/Admin_login";
import Admin_cancel from "./app/admin/admin-cancel/Admin_cancel";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Admin_emp_tickets from "./app/admin/admin-emp_tickets/Admin_emp_tickets";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin_login" element={<Admin_login />} />
          <Route path="/admin_cancel" element={<Admin_cancel />} />
          <Route path="/admin_emp_tickets" element={<Admin_emp_tickets />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
