import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
  IndianRupee,
  CheckCircle2,
  XCircle,
  PlayCircle,
  BriefcaseBusiness,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function WorkerDashboard() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchBookings = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/bookings/worker`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load bookings.");
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error("WORKER BOOKINGS ERROR:", err);
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "worker") {
      navigate("/", { replace: true });
      return;
    }

    fetchBookings();
  }, [isAuthenticated, token, user?.role, navigate]);

  const updateStatus = async (bookingId, status) => {
    const messages = {
      accepted: "Accept this booking?",
      rejected: "Reject this booking?",
      "in-progress": "Start this service?",
      completed: "Mark this service as completed?",
    };

    if (!window.confirm(messages[status] || "Update booking status?")) {
      return;
    }

    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update booking.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status,
                paymentStatus:
                  status === "completed"
                    ? "paid"
                    : booking.paymentStatus,
              }
            : booking
        )
      );
    } catch (err) {
      console.error("UPDATE BOOKING STATUS ERROR:", err);
      alert(err.message || "Unable to update booking.");
    } finally {
      setUpdatingId("");
    }
  };

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      accepted: bookings.filter((b) => b.status === "accepted").length,
      progress: bookings.filter((b) => b.status === "in-progress").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    };
  }, [bookings]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusClasses = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    "in-progress": "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-slate-200 text-slate-600",
  };

  if (!isAuthenticated || user?.role !== "worker") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <p className="text-lg font-black text-slate-900">
                Skill<span className="text-blue-600">-</span>Link
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Worker Dashboard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="outline-button hidden items-center gap-2 sm:flex"
          >
            <ArrowLeft size={17} />
            Home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8 rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-blue-500/10 sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-blue-100">
                Welcome back
              </p>
              <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                {user?.name || "Worker"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Manage incoming service requests, update booking status, and
                keep your customers informed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/worker/profile")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-50"
            >
              <UserRound size={17} />
              My Profile
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            ["Total", stats.total, "bg-slate-100 text-slate-700"],
            ["Pending", stats.pending, "bg-amber-100 text-amber-700"],
            ["Accepted", stats.accepted, "bg-blue-100 text-blue-700"],
            ["In Progress", stats.progress, "bg-purple-100 text-purple-700"],
            ["Completed", stats.completed, "bg-emerald-100 text-emerald-700"],
          ].map(([label, value, classes]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`inline-flex rounded-xl px-3 py-1 text-xs font-black ${classes}`}
              >
                {label}
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </section>

        {/* Bookings heading */}
        <section className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Customer Bookings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage your service requests.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="outline-button inline-flex items-center justify-center gap-2"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </section>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-80 items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 font-semibold text-slate-600">
                Loading customer bookings...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <XCircle className="mx-auto text-red-500" size={42} />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load bookings
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={fetchBookings}
              className="premium-button mt-6 inline-flex items-center gap-2"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={28} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              New customer requests will appear here when someone books your
              service.
            </p>
          </div>
        )}

        {/* Booking cards */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const customer = booking.customer || {};
              const isUpdating = updatingId === booking._id;

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Card header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900">
                          {booking.service || "Service Booking"}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
                            statusClasses[booking.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {String(booking.status || "pending").replace(
                            "-",
                            " "
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Booking ID: {booking._id}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-2xl font-black text-slate-900 sm:justify-end">
                        <IndianRupee size={20} />
                        {Number(booking.totalAmount || 0).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <UserRound size={19} className="text-blue-600" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Customer
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {customer.name || "Customer"}
                      </p>
                      {customer.email && (
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {customer.email}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <CalendarDays size={19} className="text-blue-600" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Date
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatDate(booking.bookingDate)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <Clock3 size={19} className="text-blue-600" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Time
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatTime(booking.bookingDate)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <MapPin size={19} className="text-blue-600" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {booking.city || "N/A"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {booking.address || "Address not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Description / phone */}
                  <div className="grid gap-4 border-t border-slate-100 px-5 py-5 sm:grid-cols-2 sm:px-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Customer Request
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {booking.description ||
                          booking.customerNote ||
                          "No additional instructions provided."}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Contact
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone size={16} className="text-blue-600" />
                        {booking.phone || customer.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:p-6">
                    {booking.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(booking._id, "rejected")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          {isUpdating ? "Updating..." : "Reject"}
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(booking._id, "accepted")
                          }
                          className="premium-button inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle2 size={17} />
                          {isUpdating ? "Updating..." : "Accept Booking"}
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(booking._id, "in-progress")
                        }
                        className="premium-button inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <PlayCircle size={17} />
                        {isUpdating ? "Updating..." : "Start Service"}
                      </button>
                    )}

                    {booking.status === "in-progress" && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(booking._id, "completed")
                        }
                        className="premium-button inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={17} />
                        {isUpdating ? "Updating..." : "Mark Completed"}
                      </button>
                    )}

                    {["completed", "rejected", "cancelled"].includes(
                      booking.status
                    ) && (
                      <span className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold capitalize text-slate-500">
                        <CheckCircle2 size={17} />
                        Booking {booking.status}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkerDashboard;
