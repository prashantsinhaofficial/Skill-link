import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  IndianRupee,
  XCircle,
  RefreshCw,
  Star,
  Send,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function MyBookings() {
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] = useState("");

  // Review states
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // =========================================================
  // NORMALIZE STATUS
  // =========================================================
  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, "-");
  };

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================
  const fetchBookings = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/bookings/customer`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("MY BOOKINGS STATUS:", response.status);
      console.log("MY BOOKINGS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load booking history."
        );
      }

      const bookingList = Array.isArray(data.bookings)
        ? data.bookings
        : [];

      // Check review status for completed bookings
      const bookingsWithReviewStatus = await Promise.all(
        bookingList.map(async (booking) => {
          const status = normalizeStatus(booking.status);

          if (status !== "completed") {
            return {
              ...booking,
              reviewSubmitted: false,
            };
          }

          try {
            const reviewResponse = await fetch(
              `${API_URL}/reviews/booking/${booking._id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const reviewData = await reviewResponse.json();

            console.log(
              "REVIEW CHECK:",
              booking._id,
              reviewData
            );

            return {
              ...booking,
              reviewSubmitted:
                reviewResponse.ok &&
                reviewData.reviewed === true,
            };
          } catch (reviewError) {
            console.error(
              "CHECK REVIEW STATUS ERROR:",
              reviewError
            );

            return {
              ...booking,
              reviewSubmitted: false,
            };
          }
        })
      );

      setBookings(bookingsWithReviewStatus);
    } catch (err) {
      console.error("MY BOOKINGS ERROR:", err);

      setError(
        err.message || "Unable to load booking history."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    if (user?.role !== "customer") {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [isAuthenticated, token, user?.role]);

  // =========================================================
  // CANCEL BOOKING
  // =========================================================
  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      const data = await response.json();

      console.log("CANCEL BOOKING RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel booking."
        );
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking
        )
      );
    } catch (err) {
      console.error("CANCEL BOOKING ERROR:", err);

      alert(
        err.message || "Unable to cancel booking."
      );
    } finally {
      setCancellingId("");
    }
  };

  // =========================================================
  // OPEN REVIEW MODAL
  // =========================================================
  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    setRating(0);
    setComment("");
    setReviewError("");
    setReviewSuccess("");
  };

  // =========================================================
  // CLOSE REVIEW MODAL
  // =========================================================
  const closeReviewModal = () => {
    if (submittingReview) {
      return;
    }

    setReviewBooking(null);
    setRating(0);
    setComment("");
    setReviewError("");
    setReviewSuccess("");
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================
  const submitReview = async () => {
    if (!reviewBooking) {
      return;
    }

    if (rating < 1 || rating > 5) {
      setReviewError(
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");
      setReviewSuccess("");

      const response = await fetch(
        `${API_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: reviewBooking._id,
            rating: Number(rating),
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("SUBMIT REVIEW STATUS:", response.status);
      console.log("SUBMIT REVIEW RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit review."
        );
      }

      // Update current booking
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === reviewBooking._id
            ? {
                ...booking,
                reviewSubmitted: true,
              }
            : booking
        )
      );

      setReviewSuccess(
        "Review submitted successfully! ⭐"
      );

      // Close modal after success
      setTimeout(() => {
        setReviewBooking(null);
        setRating(0);
        setComment("");
        setReviewSuccess("");
      }, 1200);
    } catch (err) {
      console.error("SUBMIT REVIEW ERROR:", err);

      setReviewError(
        err.message || "Unable to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // =========================================================
  // STATUS COLOR
  // =========================================================
  const getStatusClasses = (status) => {
    switch (normalizeStatus(status)) {
      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "in-progress":
        return "bg-purple-100 text-purple-700";

      case "completed":
        return "bg-emerald-100 text-emerald-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  // =========================================================
  // DATE
  // =========================================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // TIME
  // =========================================================
  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main
        id="my-bookings"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* =====================================================
            NOT LOGGED IN
        ====================================================== */}
        {!loading &&
          (!isAuthenticated ||
            !token ||
            user?.role !== "customer") && (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <CalendarDays
                  className="text-blue-600"
                  size={38}
                />
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900">
                My Bookings
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Login as a customer to view your
                bookings and booking history.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="premium-button mt-6"
              >
                Login to View Bookings
              </button>
            </div>
          )}

        {/* =====================================================
            LOADING
        ====================================================== */}
        {isAuthenticated &&
          user?.role === "customer" &&
          loading && (
            <div className="flex min-h-100 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 font-semibold text-slate-600">
                  Loading your bookings...
                </p>
              </div>
            </div>
          )}

        {/* =====================================================
            ERROR
        ====================================================== */}
        {isAuthenticated &&
          user?.role === "customer" &&
          !loading &&
          error && (
            <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
              <XCircle
                className="mx-auto text-red-500"
                size={42}
              />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Unable to load bookings
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {error}
              </p>

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

        {/* =====================================================
            EMPTY BOOKINGS
        ====================================================== */}
        {isAuthenticated &&
          user?.role === "customer" &&
          !loading &&
          !error &&
          bookings.length === 0 && (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <CalendarDays
                  className="text-blue-600"
                  size={38}
                />
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900">
                No bookings yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                You have not booked any service yet.
                Find a skilled worker and make your
                first booking.
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="premium-button mt-6"
              >
                Find a Worker
              </button>
            </div>
          )}

        {/* =====================================================
            BOOKINGS LIST
        ====================================================== */}
        {isAuthenticated &&
          user?.role === "customer" &&
          !loading &&
          !error &&
          bookings.length > 0 && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Total bookings
                  </p>

                  <p className="text-2xl font-black text-slate-900">
                    {bookings.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchBookings}
                  className="outline-button flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              {/* Booking Cards */}
              {bookings.map((booking) => {
                const worker = booking.worker || {};
                const workerUser = worker.user || {};

                const status = normalizeStatus(
                  booking.status
                );

                const isCompleted =
                  status === "completed";

                const canCancel =
                  status === "pending" ||
                  status === "accepted";

                return (
                  <div
                    key={booking._id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100"
                  >
                    {/* Card Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                          <UserRound
                            size={25}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <h2 className="font-bold text-slate-900">
                            {workerUser.name ||
                              worker.name ||
                              "Service Worker"}
                          </h2>

                          <p className="text-sm text-slate-500">
                            {worker.profession ||
                              booking.service ||
                              "Service"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </div>

                    {/* Booking Information */}
                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
                      {/* Date */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <CalendarDays
                          size={20}
                          className="text-blue-600"
                        />

                        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatDate(
                            booking.bookingDate
                          )}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <Clock3
                          size={20}
                          className="text-blue-600"
                        />

                        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Time
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatTime(
                            booking.bookingDate
                          )}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <MapPin
                          size={20}
                          className="text-blue-600"
                        />

                        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {booking.city || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.address || ""}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <IndianRupee
                          size={20}
                          className="text-blue-600"
                        />

                        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-900">
                          ₹
                          {Number(
                            booking.totalAmount || 0
                          ).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Service
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {booking.service || "Service"}
                      </p>

                      {booking.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {booking.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:p-6">
                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/booking-success/${booking._id}`
                          )
                        }
                        className="outline-button"
                      >
                        View Details
                      </button>

                      {/* =================================================
                          RATE WORKER
                      ================================================== */}
                      {isCompleted &&
                        !booking.reviewSubmitted && (
                          <button
                            type="button"
                            onClick={() =>
                              openReviewModal(
                                booking
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                          >
                            <Star
                              size={17}
                              fill="currentColor"
                            />
                            Rate Worker
                          </button>
                        )}

                      {/* =================================================
                          REVIEW SUBMITTED
                      ================================================== */}
                      {isCompleted &&
                        booking.reviewSubmitted && (
                          <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-5 py-3 text-sm font-bold text-emerald-700">
                            <Star
                              size={17}
                              fill="currentColor"
                            />
                            Review Submitted
                          </span>
                        )}

                      {/* Cancel */}
                      {canCancel && (
                        <button
                          type="button"
                          disabled={
                            cancellingId ===
                            booking._id
                          }
                          onClick={() =>
                            cancelBooking(
                              booking._id
                            )
                          }
                          className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancellingId ===
                          booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>

      {/* =========================================================
          REVIEW MODAL
      ========================================================== */}
      {reviewBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeReviewModal();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                    <Star
                      size={23}
                      className="text-amber-500"
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Rate Your Experience
                    </h2>

                    <p className="text-sm text-slate-500">
                      Share your experience with
                      the worker
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeReviewModal}
                  disabled={submittingReview}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  aria-label="Close review modal"
                >
                  <XCircle size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-6">
              {/* Worker */}
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Worker
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {reviewBooking.worker?.user
                    ?.name ||
                    reviewBooking.worker
                      ?.name ||
                    "Service Worker"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {reviewBooking.worker
                    ?.profession ||
                    reviewBooking.service ||
                    "Service"}
                </p>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Your Rating
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={
                          submittingReview
                        }
                        onClick={() =>
                          setRating(star)
                        }
                        className="rounded-xl p-1 transition hover:scale-110 disabled:cursor-not-allowed"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={36}
                          className={
                            star <= rating
                              ? "text-amber-400"
                              : "text-slate-300"
                          }
                          fill={
                            star <= rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    )
                  )}
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {rating === 0
                    ? "Select a rating"
                    : rating === 1
                    ? "Poor"
                    : rating === 2
                    ? "Fair"
                    : rating === 3
                    ? "Good"
                    : rating === 4
                    ? "Very Good"
                    : "Excellent"}
                </p>
              </div>

              {/* =====================================================
                  COMMENT BOX
              ====================================================== */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="review-comment"
                    className="text-sm font-bold text-slate-700"
                  >
                    Your Comment
                  </label>

                  <span className="text-xs font-semibold text-slate-400">
                    {comment.length}/500
                  </span>
                </div>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) =>
                    setComment(
                      event.target.value.slice(
                        0,
                        500
                      )
                    )
                  }
                  disabled={submittingReview}
                  rows={5}
                  placeholder="Tell us about your experience with this worker..."
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Your feedback helps other customers
                  choose reliable workers.
                </p>
              </div>

              {/* Error */}
              {reviewError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {reviewError}
                </div>
              )}

              {/* Success */}
              {reviewSuccess && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {reviewSuccess}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={submitReview}
                disabled={
                  submittingReview ||
                  rating === 0
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingReview ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;