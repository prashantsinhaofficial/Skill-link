import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  IndianRupee,
  Home,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function BookingSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load booking.");
        }

        setBooking(data.booking);
      } catch (err) {
        setError(err.message || "Unable to load booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, token, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 font-semibold text-slate-600">
            Loading booking...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl font-bold text-red-600">!</span>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Booking not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "We could not find this booking."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="premium-button mt-6 inline-flex items-center gap-2"
          >
            <Home size={18} />
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const worker = booking.worker || {};
  const workerUser = worker.user || {};

  const bookingDate = new Date(booking.bookingDate);

  const formattedDate = bookingDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = bookingDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2
              size={46}
              className="text-emerald-600"
              strokeWidth={2.5}
            />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Booking Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Your service request is confirmed
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Your booking has been successfully created. The worker can now
            review and accept your service request.
          </p>
        </div>

        {/* Booking ID */}
        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Booking ID
          </p>

          <p className="mt-1 break-all font-mono text-sm font-bold text-emerald-900">
            {booking._id}
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">

          {/* Worker */}
          <div className="border-b border-slate-100 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Service Provider
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <UserRound className="text-blue-600" size={26} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {workerUser.name || worker.name || "Service Worker"}
                </h2>

                <p className="text-sm text-slate-500">
                  {worker.profession || booking.service}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

            <div className="rounded-2xl bg-slate-50 p-5">
              <CalendarDays className="text-blue-600" size={22} />

              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Date
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <Clock3 className="text-blue-600" size={22} />

              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Time
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {formattedTime}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <MapPin className="text-blue-600" size={22} />

              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Service Location
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {booking.city}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {booking.address}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <IndianRupee className="text-blue-600" size={22} />

              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Amount
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                ₹{Number(booking.totalAmount || 0).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-slate-100 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900">
              Price Breakdown
            </h3>

            <div className="mt-4 space-y-3">

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Service ({booking.estimatedHours || 1} hr)
                </span>

                <span className="font-semibold text-slate-900">
                  ₹{Number(booking.serviceAmount || 0).toFixed(0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Doorstep fee
                </span>

                <span className="font-semibold text-slate-900">
                  ₹{Number(booking.doorstepFee || 0).toFixed(0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Welfare cess (3%)
                </span>

                <span className="font-semibold text-slate-900">
                  ₹{Number(booking.welfareCess || 0).toFixed(0)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-xl font-black text-blue-600">
                    ₹{Number(booking.totalAmount || 0).toFixed(0)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Status */}
          <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Status
                </p>

                <p className="mt-1 text-lg font-bold capitalize text-slate-900">
                  {booking.status || "pending"}
                </p>
              </div>

              <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold capitalize text-amber-700">
                {booking.status || "pending"}
              </div>

            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => navigate("/my-bookings")}
            className="premium-button flex items-center justify-center gap-2"
          >
            View My Bookings
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="outline-button flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </button>

        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;