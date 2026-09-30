import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function WorkerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    isAuthenticated,
  } = useAuth();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH WORKER DETAILS
  // =========================================================
  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) {
        setError("Worker ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/workers/${id}`
        );

        const data = await response.json();

        console.log(
          "WORKER DETAILS STATUS:",
          response.status
        );

        console.log(
          "WORKER DETAILS RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load worker details."
          );
        }

        setWorker(data.worker || data);
      } catch (err) {
        console.error(
          "WORKER DETAILS ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to load worker details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  // =========================================================
  // BOOK SERVICE
  // =========================================================
  const handleBookService = () => {
    // Login required
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/workers/${id}`,
        },
      });

      return;
    }

    // Check worker data
    if (!worker?._id) {
      alert(
        "Worker information is not available."
      );

      return;
    }

    console.log(
      "BOOKING WORKER ID:",
      worker._id
    );

    // Directly open booking page
    navigate(`/booking/${worker._id}`);
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg"
              >
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <p className="text-lg font-black text-slate-900">
                  Skill
                  <span className="text-blue-600">
                    -
                  </span>
                  Link
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Worker Profile
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600 sm:flex"
            >
              <ArrowLeft size={17} />
              Back
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_400px]">
            <div className="animate-pulse rounded-4xl bg-white p-7 shadow-sm">
              <div className="h-36 rounded-3xl bg-slate-200" />

              <div className="mt-8 flex items-center gap-5">
                <div className="h-24 w-24 rounded-3xl bg-slate-200" />

                <div>
                  <div className="h-7 w-48 rounded bg-slate-200" />
                  <div className="mt-3 h-5 w-32 rounded bg-slate-200" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
              </div>
            </div>

            <div className="animate-pulse rounded-4xl bg-white p-7 shadow-sm">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="mt-5 h-10 w-40 rounded bg-slate-200" />
              <div className="mt-8 h-16 rounded-2xl bg-slate-100" />
              <div className="mt-5 h-14 rounded-xl bg-slate-200" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !worker) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center px-5 py-5 lg:px-8">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <p className="text-lg font-black text-slate-900">
                  Skill
                  <span className="text-blue-600">
                    -
                  </span>
                  Link
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Worker Profile
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-5">
          <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <UserRound size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Worker not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error ||
                "We could not find this worker profile."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Workers
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // WORKER DATA
  // =========================================================
  const workerName =
    worker.user?.name ||
    worker.name ||
    "Skill-Link Worker";

  const profession =
    worker.profession ||
    "Service Professional";

  const rating = Number(
    worker.rating || 0
  ).toFixed(1);

  const totalReviews = Number(
    worker.totalReviews || 0
  );

  const completedJobs = Number(
    worker.completedJobs || 0
  );

  const experience = Number(
    worker.experience || 0
  );

  const hourlyRate = Number(
    worker.hourlyRate || 0
  );

  const serviceRadius = Number(
    worker.serviceRadius || 0
  );

  const phone =
    worker.phone ||
    worker.user?.phone ||
    "Not provided";

  const city =
    worker.city ||
    "Local area";

  const bio =
    worker.bio ||
    "Professional service provider available through Skill-Link.";

  const skills = Array.isArray(worker.skills)
    ? worker.skills
    : [];

  const isAvailable =
    worker.isAvailable !== false;

  const initials = workerName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // =========================================================
  // MAIN
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <p className="text-lg font-black text-slate-900">
                Skill
                <span className="text-blue-600">
                  -
                </span>
                Link
              </p>

              <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Worker Profile
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600 sm:flex"
          >
            <ArrowLeft size={17} />
            Back
          </button>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to workers
        </button>

        <div className="grid gap-7 lg:grid-cols-[1fr_400px]">

          {/* =================================================
              LEFT
          ================================================== */}
          <div className="space-y-7">

            {/* Worker Profile */}
            <section className="overflow-hidden rounded-4xl bg-white shadow-sm ring-1 ring-slate-200">

              <div className="relative h-36 overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700">
                <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative px-7 pb-7 sm:px-8">

                <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                  <div className="flex items-end gap-5">

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-linear-to-br from-blue-500 to-violet-600 text-4xl font-black text-white shadow-xl">
                      {initials}
                    </div>

                    <div className="pb-1">
                      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {workerName}
                      </h1>

                      <p className="mt-1 text-base font-bold text-blue-600">
                        {profession}
                      </p>
                    </div>

                  </div>

                  <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
                      isAvailable
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isAvailable
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {isAvailable
                      ? "Available for jobs"
                      : "Currently unavailable"}
                  </div>

                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <Star
                        size={19}
                        fill="currentColor"
                        className="text-amber-500"
                      />

                      <span className="text-lg font-black text-slate-900">
                        {rating}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      {totalReviews} reviews
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={19}
                        className="text-emerald-600"
                      />

                      <span className="text-lg font-black text-slate-900">
                        {completedJobs}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Jobs completed
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <Clock3
                        size={19}
                        className="text-blue-600"
                      />

                      <span className="text-lg font-black text-slate-900">
                        {experience}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Years experience
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={19}
                        className="text-violet-600"
                      />

                      <span className="text-lg font-black text-slate-900">
                        {serviceRadius}km
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Service radius
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* About */}
            <section className="rounded-4xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <h2 className="text-2xl font-black text-slate-900">
                About this professional
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                {bio}
              </p>
            </section>

            {/* Skills */}
            <section className="rounded-4xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <BriefcaseBusiness size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Skills & expertise
                  </h2>

                  <p className="text-sm text-slate-400">
                    Services this professional can provide
                  </p>
                </div>

              </div>

              {skills.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {skills.map(
                    (skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-400">
                  No specific skills added yet.
                </p>
              )}
            </section>

            {/* Location */}
            <section className="rounded-4xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <MapPin size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Service location
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {city}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Available within approximately{" "}
                    {serviceRadius} km
                  </p>
                </div>

              </div>
            </section>

          </div>

          {/* =================================================
              RIGHT
          ================================================== */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">

            <div className="rounded-4xl bg-white p-7 shadow-sm ring-1 ring-slate-200">

              {/* Price */}
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Starting price
              </p>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">
                  ₹{hourlyRate}
                </span>

                <span className="mb-1 text-sm font-semibold text-slate-400">
                  /hour
                </span>
              </div>

              {/* Availability */}
              <div
                className={`mt-7 rounded-2xl p-4 ${
                  isAvailable
                    ? "bg-emerald-50"
                    : "bg-slate-100"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-black ${
                        isAvailable
                          ? "text-emerald-700"
                          : "text-slate-600"
                      }`}
                    >
                      {isAvailable
                        ? "Available"
                        : "Currently unavailable"}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        isAvailable
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {isAvailable
                        ? "Ready to receive service requests"
                        : "Not accepting new requests"}
                    </p>
                  </div>

                </div>
              </div>

              {/* =================================================
                  BOOK SERVICE BUTTON
              ================================================== */}
              <button
                type="button"
                onClick={handleBookService}
                disabled={!isAvailable}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isAvailable
                  ? "Book Service"
                  : "Currently Unavailable"}

                <ArrowRight size={18} />
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                {!isAuthenticated
                  ? "Login to book this service."
                  : "Click Book Service to continue with your booking."}
              </p>

              <div className="my-7 border-t border-slate-100" />

              {/* Contact */}
              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Contact
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-800">
                    {phone}
                  </p>
                </div>

              </div>

              {/* Safety */}
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Skill-Link safety
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Service bookings are designed with
                      transparent pricing and safety support.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Quick Facts */}
            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Quick facts
              </p>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <MapPin
                      size={16}
                      className="text-blue-600"
                    />
                    Location
                  </span>

                  <span className="truncate text-sm font-bold text-slate-800">
                    {city}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <IndianRupee
                      size={16}
                      className="text-blue-600"
                    />
                    Rate
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    ₹{hourlyRate}/hr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Users
                      size={16}
                      className="text-blue-600"
                    />
                    Jobs
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {completedJobs}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Clock3
                      size={16}
                      className="text-blue-600"
                    />
                    Experience
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {experience} years
                  </span>
                </div>

              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* =====================================================
          MOBILE BOOK BUTTON
      ====================================================== */}
      <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={handleBookService}
          disabled={!isAvailable}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAvailable
            ? "Book Service"
            : "Currently Unavailable"}

          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default WorkerDetails;