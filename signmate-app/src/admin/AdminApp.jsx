import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout.jsx";
import UsersPage from "./pages/UsersPage";
import ContractsPage from "./pages/ContractsPage";

export default function AdminApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="users" element={<UsersPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="" element={<Navigate to="users" replace />} />
        <Route path="*" element={<Navigate to="users" replace />} />
      </Routes>
    </AdminLayout>
  );
}
