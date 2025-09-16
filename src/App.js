import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadFile from "./pages/UploadFile";
import Transactions from "./pages/TransactionPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import UploadedFiles from "./pages/UploadedFiles";
import DatasetView from "./pages/DatasetView";
import OTPVerification from "./pages/OtpVerification"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPVerification />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadFile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <UploadedFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dataset/:id"
          element={
            <ProtectedRoute>
              <DatasetView  />
            </ProtectedRoute>
          }
        />
        </Routes>
    </Router>
  );
}
