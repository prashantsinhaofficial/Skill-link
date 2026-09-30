import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  IndianRupee,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const DOORSTEP_FEE = 49;
const WELFARE_RATE = 0.03;

/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) {
    return "Select date";
  }

  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsed.getTime())) {
    return "Select date";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatCurrency = (amount) => {
  return `₹${Number(
    amount || 0
  ).toFixed(0)}`;
};

/* =========================================================
   FIELD ICON
========================================================= */

function FieldIcon({ children }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-400">
      {children}
    </span>
  );
}

/* =========================================================
   BOOKING PAGE
========================================================= */

function Booking() {
  const navigate = useNavigate();
  const { workerId } = useParams();

  const {
    token,
    isAuthenticated,
  } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [worker, setWorker] =
    useState(null);

  const [loadingWorker, setLoadingWorker] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [service, setService] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [bookingDate, setBookingDate] =
    useState("");

  const [bookingTime, setBookingTime] =
    useState("");

  const [estimatedHours, setEstimatedHours] =
    useState("1");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [phone, setPhone] =
    useState("");

  /* =======================================================
     FETCH WORKER
  ======================================================= */

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/booking/${workerId}`,
        },
      });

      return;
    }

    if (!workerId) {
      setError(
        "Worker information is missing."
      );

      setLoadingWorker(false);

      return;
    }

    const fetchWorker = async () => {
      try {
        setLoadingWorker(true);
        setError("");

        const response = await fetch(
          `${API_URL}/workers/${workerId}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load worker."
          );
        }

        const workerData =
          data.worker ||
          data.data;

        if (!workerData) {
          throw new Error(
            "Worker information is unavailable."
          );
        }

        setWorker(workerData);

        setService(
          workerData.profession ||
            ""
        );

        if (
          workerData.user?.phone
        ) {
          setPhone(
            workerData.user.phone
          );
        } else if (
          workerData.phone
        ) {
          setPhone(
            workerData.phone
          );
        }

        if (workerData.city) {
          setCity(
            workerData.city
          );
        }
      } catch (err) {
        console.error(
          "FETCH WORKER ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to load worker."
        );
      } finally {
        setLoadingWorker(false);
      }
    };

    fetchWorker();
  }, [
    isAuthenticated,
    token,
    workerId,
    navigate,
  ]);

  /* =======================================================
     WORKER DATA
  ======================================================= */

  const workerName =
    worker?.user?.name ||
    worker?.name ||
    "Service Worker";

  const workerProfession =
    worker?.profession ||
    "Service Professional";

  const workerRate = Number(
    worker?.hourlyRate || 0
  );

  const workerAvailable =
    worker?.isAvailable !== false;

  /* =======================================================
     PRICE CALCULATION
  ======================================================= */

  const priceDetails = useMemo(() => {
    const hours = Math.max(
      1,
      Number(estimatedHours) || 1
    );

    const serviceAmount =
      workerRate * hours;

    const welfareCess =
      (serviceAmount +
        DOORSTEP_FEE) *
      WELFARE_RATE;

    const totalAmount =
      serviceAmount +
      DOORSTEP_FEE +
      welfareCess;

    return {
      hours,
      serviceAmount,
      doorstepFee: DOORSTEP_FEE,
      welfareCess,
      totalAmount,
    };
  }, [
    workerRate,
    estimatedHours,
  ]);

  /* =======================================================
     FORM VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!service.trim()) {
      return "Please enter the required service.";
    }

    if (!bookingDate) {
      return "Please select a booking date.";
    }

    if (!bookingTime) {
      return "Please select a booking time.";
    }

    if (
      bookingDate <
      getToday()
    ) {
      return "Please select a future date.";
    }

    if (
      !estimatedHours ||
      Number(estimatedHours) < 1
    ) {
      return "Estimated hours must be at least 1.";
    }

    if (!address.trim()) {
      return "Please enter your service address.";
    }

    if (!city.trim()) {
      return "Please enter your city.";
    }

    const cleanPhone =
      phone.replace(/\D/g, "");

    if (
      cleanPhone.length !== 10
    ) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!worker) {
      return "Worker information is unavailable.";
    }

    if (!workerAvailable) {
      return "This worker is currently unavailable.";
    }

    return "";
  };

  /* =======================================================
     SUBMIT BOOKING
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setSubmitting(true);

      const combinedDate =
        `${bookingDate}T${bookingTime}:00`;

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            workerId,
            service:
              service.trim(),
            description:
              description.trim(),
            address:
              address.trim(),
            city:
              city.trim(),
            phone:
              phone.replace(/\D/g, ""),
            bookingDate:
              combinedDate,
            estimatedHours:
              Number(
                estimatedHours
              ),
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "CREATE BOOKING STATUS:",
        response.status
      );

      console.log(
        "CREATE BOOKING RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create booking."
        );
      }

      const createdBooking =
        data.booking ||
        data.data;

      if (
        !createdBooking?._id
      ) {
        throw new Error(
          "Booking was created but booking ID was not returned."
        );
      }

      setSuccessMessage(
        "Booking created successfully."
      );

      navigate(
        `/booking-success/${createdBooking._id}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "CREATE BOOKING ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to create booking."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     BACK BUTTON
  ======================================================= */

  const handleBack = () => {
    if (workerId) {
      navigate(
        `/workers/${workerId}`
      );
    } else {
      navigate("/");
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingWorker) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="flex min-h-screen items-center justify-center px-5">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">

              <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            </div>

            <p className="mt-4 text-sm font-bold text-slate-600">
              Loading booking details...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================
          TOP NAVIGATION
      =================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 lg:px-8">

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
          >

            <ArrowLeft
              size={17}
              strokeWidth={2.3}
            />

            Back to Worker

          </button>

        </div>

      </header>

      {/* ===================================================
          PAGE CONTENT
      =================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-10">

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">

              <AlertCircle
                size={17}
              />

            </div>

            <div className="min-w-0">

              <p className="text-sm font-bold text-red-700">
                Booking error
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            SUCCESS MESSAGE
        ================================================== */}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">

            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-sm font-bold text-emerald-700">
              {successMessage}
            </p>

          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================== */}

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* =================================================
              LEFT BOOKING FORM
          ================================================== */}

          <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="px-5 pb-4 pt-6 sm:px-6">

              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Service Booking
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Book a service
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Enter your service details and choose a convenient time.
              </p>

            </div>

            {/* WORKER */}

            <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 sm:mx-6">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-black text-white">

                {workerName
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Booking with
                </p>

                <p className="truncate text-xs font-black text-slate-900">
                  {workerName}
                </p>

                <p className="truncate text-[10px] font-semibold text-blue-600">
                  {workerProfession}
                </p>

              </div>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="px-5 pb-5 sm:px-6 sm:pb-6"
            >

              {/* =================================================
                  SERVICE
              ================================================== */}

              <div className="mb-4">

                <label
                  htmlFor="service"
                  className="mb-1.5 block text-[10px] font-bold text-slate-700"
                >
                  Service Required
                </label>

                <div className="relative">

                  <FieldIcon>

                    <BriefcaseBusiness
                      size={16}
                    />

                  </FieldIcon>

                  <input
                    id="service"
                    type="text"
                    value={service}
                    onChange={(event) =>
                      setService(
                        event.target.value
                      )
                    }
                    placeholder="Electrician"
                    className="booking-input pl-10"
                  />

                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <div className="mb-4">

                <label
                  htmlFor="description"
                  className="mb-1.5 block text-[10px] font-bold text-slate-700"
                >
                  Describe your requirement
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-3.5 top-3.5 z-10 flex h-5 w-5 items-center justify-center text-slate-400">

                    <FileText
                      size={16}
                    />

                  </span>

                  <textarea
                    id="description"
                    value={
                      description
                    }
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Tell the worker what work you need..."
                    rows={4}
                    maxLength={500}
                    className="booking-textarea pl-10"
                  />

                </div>

                <div className="mt-1 flex justify-end">

                  <span className="text-[9px] text-slate-400">
                    {
                      description.length
                    }
                    /500
                  </span>

                </div>

              </div>

              {/* =================================================
                  DATE + HOUR
              ================================================== */}

              <div className="mb-4 grid gap-3 sm:grid-cols-2">

                {/* DATE */}

                <div>

                  <label
                    htmlFor="bookingDate"
                    className="mb-1.5 block text-[10px] font-bold text-slate-700"
                  >
                    Date
                  </label>

                  <div className="relative">

                    <FieldIcon>

                      <CalendarDays
                        size={16}
                      />

                    </FieldIcon>

                    <input
                      id="bookingDate"
                      type="date"
                      min={
                        getToday()
                      }
                      value={
                        bookingDate
                      }
                      onChange={(event) =>
                        setBookingDate(
                          event.target.value
                        )
                      }
                      className="booking-input booking-date-input pl-10"
                    />

                  </div>

                </div>

                {/* HOUR */}

                <div>

                  <label
                    htmlFor="bookingTime"
                    className="mb-1.5 block text-[10px] font-bold text-slate-700"
                  >
                    Hour
                  </label>

                  <div className="relative">

                    <FieldIcon>

                      <Clock3
                        size={16}
                      />

                    </FieldIcon>

                    <input
                      id="bookingTime"
                      type="time"
                      value={
                        bookingTime
                      }
                      onChange={(event) =>
                        setBookingTime(
                          event.target.value
                        )
                      }
                      className="booking-input pl-10"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  ESTIMATED HOURS
              ================================================== */}

              <div className="mb-4">

                <label
                  htmlFor="estimatedHours"
                  className="mb-1.5 block text-[10px] font-bold text-slate-700"
                >
                  Estimated Hours
                </label>

                <div className="relative">

                  <FieldIcon>

                    <Clock3
                      size={16}
                    />

                  </FieldIcon>

                  <input
                    id="estimatedHours"
                    type="number"
                    min="1"
                    max="24"
                    step="1"
                    value={
                      estimatedHours
                    }
                    onChange={(event) =>
                      setEstimatedHours(
                        event.target.value
                      )
                    }
                    className="booking-input pl-10"
                  />

                </div>

              </div>

              {/* =================================================
                  ADDRESS
              ================================================== */}

              <div className="mb-4">

                <label
                  htmlFor="address"
                  className="mb-1.5 block text-[10px] font-bold text-slate-700"
                >
                  Service Address
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-3.5 top-4 z-10 flex h-5 w-5 items-center justify-center text-slate-400">

                    <MapPin
                      size={16}
                    />

                  </span>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    placeholder="House / street / landmark"
                    rows={3}
                    className="booking-textarea min-h-[82px] pl-10"
                  />

                </div>

              </div>

              {/* =================================================
                  CITY + PHONE
              ================================================== */}

              <div className="mb-4 grid gap-3 sm:grid-cols-2">

                {/* CITY */}

                <div>

                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-[10px] font-bold text-slate-700"
                  >
                    City
                  </label>

                  <div className="relative">

                    <FieldIcon>

                      <MapPin
                        size={16}
                      />

                    </FieldIcon>

                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(event) =>
                        setCity(
                          event.target.value
                        )
                      }
                      placeholder="Koderma"
                      className="booking-input pl-10"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-[10px] font-bold text-slate-700"
                  >
                    Phone
                  </label>

                  <div className="relative">

                    <FieldIcon>

                      <Phone
                        size={16}
                      />

                    </FieldIcon>

                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(
                              0,
                              10
                            );

                        setPhone(
                          value
                        );
                      }}
                      placeholder="10-digit mobile number"
                      className="booking-input pl-10"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  MINI PRICE SUMMARY
              ================================================== */}

              <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3">

                <div className="flex items-center justify-between">

                  <span className="text-[10px] font-semibold text-slate-500">
                    Service amount
                  </span>

                  <span className="text-xs font-black text-slate-800">
                    {formatCurrency(
                      priceDetails.serviceAmount
                    )}
                  </span>

                </div>

                <div className="mt-2 flex items-center justify-between">

                  <span className="text-[10px] font-semibold text-slate-500">
                    Doorstep fee
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {formatCurrency(
                      DOORSTEP_FEE
                    )}
                  </span>

                </div>

                <div className="mt-2 flex items-center justify-between">

                  <span className="text-[10px] font-semibold text-slate-500">
                    Welfare cess (3%)
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {formatCurrency(
                      priceDetails.welfareCess
                    )}
                  </span>

                </div>

              </div>

              {/* =================================================
                  CONFIRM BOOKING
              ================================================== */}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !workerAvailable
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-xs font-black text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm Booking

                    <ArrowRight
                      size={15}
                    />

                  </>
                )}

              </button>

            </form>

          </section>

          {/* =================================================
              RIGHT BOOKING SUMMARY
          ================================================== */}

          <aside className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">

            {/* HEADER */}

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Booking Summary
              </p>

              <h2 className="mt-1 text-sm font-black text-slate-900">
                Price details
              </h2>

            </div>

            {/* WORKER */}

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <UserRound
                  size={16}
                />

              </div>

              <div className="min-w-0">

                <p className="truncate text-[10px] font-black text-slate-900">
                  {workerName}
                </p>

                <p className="truncate text-[9px] font-semibold text-blue-600">
                  {workerProfession}
                </p>

              </div>

            </div>

            {/* PRICE DETAILS */}

            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-[10px] font-medium text-slate-500">
                  Service
                </span>

                <span className="text-[10px] font-bold text-slate-800">
                  {formatCurrency(
                    priceDetails.serviceAmount
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-[10px] font-medium text-slate-500">
                  Doorstep fee
                </span>

                <span className="text-[10px] font-bold text-slate-800">
                  {formatCurrency(
                    DOORSTEP_FEE
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-[10px] font-medium text-slate-500">
                  Welfare cess (3%)
                </span>

                <span className="text-[10px] font-bold text-slate-800">
                  {formatCurrency(
                    priceDetails.welfareCess
                  )}
                </span>

              </div>

            </div>

            {/* TOTAL LINE */}

            <div className="my-4 h-px bg-slate-100" />

            <div className="flex items-center justify-between">

              <span className="text-xs font-black text-slate-900">
                Total
              </span>

              <span className="flex items-center gap-1 text-lg font-black text-blue-600">

                <IndianRupee
                  size={15}
                />

                {Number(
                  priceDetails.totalAmount
                ).toFixed(0)}

              </span>

            </div>

            {/* RATE */}

            <div className="mt-4 rounded-xl bg-slate-50 p-3">

              <div className="flex items-center justify-between">

                <span className="text-[9px] font-medium text-slate-500">
                  Worker rate
                </span>

                <span className="text-[10px] font-black text-slate-800">
                  {formatCurrency(
                    workerRate
                  )}
                  /hour
                </span>

              </div>

              <div className="mt-2 flex items-center justify-between">

                <span className="text-[9px] font-medium text-slate-500">
                  Estimated duration
                </span>

                <span className="text-[10px] font-black text-slate-800">
                  {
                    priceDetails.hours
                  }{" "}
                  hour
                  {priceDetails.hours !==
                  1
                    ? "s"
                    : ""}
                </span>

              </div>

            </div>

            {/* TRANSPARENT PRICING */}

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">

              <div className="flex items-start gap-2">

                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                  <p className="text-[10px] font-black text-blue-800">
                    Transparent pricing
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-blue-600">
                    Service amount, doorstep fee and welfare cess are shown before you confirm.
                  </p>

                </div>

              </div>

            </div>

            {/* AVAILABILITY */}

            <div
              className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 ${
                workerAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >

              <CheckCircle2
                size={14}
                className="shrink-0"
              />

              <span className="text-[9px] font-bold">
                {workerAvailable
                  ? "Worker is available"
                  : "Worker is unavailable"}
              </span>

            </div>

            {/* SELECTED DATE */}

            {bookingDate && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-white p-3">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={14}
                    className="text-blue-600"
                  />

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                      Selected date
                    </p>

                    <p className="mt-0.5 text-[10px] font-bold text-slate-800">
                      {formatDate(
                        bookingDate
                      )}
                    </p>

                  </div>

                </div>

                {bookingTime && (
                  <div className="mt-2 flex items-center gap-2">

                    <Clock3
                      size={14}
                      className="text-blue-600"
                    />

                    <p className="text-[10px] font-bold text-slate-800">
                      {bookingTime}
                    </p>

                  </div>
                )}

              </div>
            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Booking;