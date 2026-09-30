import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import WorkerProfile from "./pages/worker/WorkerProfile";
import WorkerDashboard from "./pages/worker/WorkerDashboard";

import WorkerDetails from "./pages/workers/WorkerDetails";

import Booking from "./pages/booking/Booking";
import BookingSuccess from "./pages/booking/BookingSuccess";
import MyBookings from "./pages/booking/MyBookings";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* WORKER DETAILS */}
          <Route
            path="/workers/:id"
            element={<WorkerDetails />}
          />

          {/* CUSTOMER BOOKING */}
          <Route
            path="/booking/:workerId"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          {/* BOOKING SUCCESS */}
          <Route
            path="/booking-success/:id"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />

          {/* CUSTOMER MY BOOKINGS */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* WORKER PROFILE */}
          <Route
            path="/worker/profile"
            element={
              <ProtectedRoute>
                <WorkerProfile />
              </ProtectedRoute>
            }
          />

          {/* WORKER DASHBOARD */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Home />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;