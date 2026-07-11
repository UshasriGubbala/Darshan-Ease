import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Temples from "./pages/Temples";
import TempleDetail from "./pages/TempleDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLogin from "./pages/AdminLogin";
import BookingForm from "./pages/BookingForm";
import BookingDetail from "./pages/BookingDetail";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTemples from "./pages/admin/ManageTemples";
import ManagePoojas from "./pages/admin/ManagePoojas";
import ManageSlots from "./pages/admin/ManageSlots";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public / user-facing routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/temples" element={<PublicLayout><Temples /></PublicLayout>} />
      <Route path="/temples/:id" element={<PublicLayout><TempleDetail /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/admin-login" element={<PublicLayout><AdminLogin /></PublicLayout>} />

      <Route
        path="/book/:slotId"
        element={
          <PublicLayout>
            <ProtectedRoute><BookingForm /></ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <PublicLayout>
            <ProtectedRoute><BookingDetail /></ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PublicLayout>
            <ProtectedRoute><MyBookings /></ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PublicLayout>
            <ProtectedRoute><Profile /></ProtectedRoute>
          </PublicLayout>
        }
      />

      {/* Admin routes (own layout, no public navbar/footer) */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/temples" element={<AdminRoute><ManageTemples /></AdminRoute>} />
      <Route path="/admin/poojas" element={<AdminRoute><ManagePoojas /></AdminRoute>} />
      <Route path="/admin/slots" element={<AdminRoute><ManageSlots /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <div className="empty-state">
              <h2>Page not found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
  );
}
