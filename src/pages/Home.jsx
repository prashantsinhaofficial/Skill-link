import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  HardHat,
  HeartHandshake,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

/* =========================================================
   SERVICE CATEGORIES
========================================================= */

const categories = [
  {
    name: "Electrician",
    icon: Zap,
  },
  {
    name: "Plumber",
    icon: Wrench,
  },
  {
    name: "Carpenter",
    icon: HardHat,
  },
  {
    name: "Painter",
    icon: Sparkles,
  },
  {
    name: "AC Technician",
    icon: Clock3,
  },
  {
    name: "Cleaner",
    icon: HeartHandshake,
  },
];

/* =========================================================
   DOORSTEP PRICING
========================================================= */

const pricing = [
  {
    distance: "0–3 km",
    price: "₹49",
  },
  {
    distance: "3–7 km",
    price: "₹69",
  },
  {
    distance: "7–12 km",
    price: "₹109",
  },
  {
    distance: "12+ km",
    price: "₹149",
  },
];

/* =========================================================
   FEATURES
========================================================= */

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description:
      "Connect with trusted service professionals through a transparent platform.",
  },
  {
    icon: WalletCards,
    title: "Transparent Pricing",
    description:
      "Know the service and doorstep charges before confirming a booking.",
  },
  {
    icon: HeartHandshake,
    title: "Fair Worker Economy",
    description:
      "Workers keep more of their earnings with a cooperative-first model.",
  },
  {
    icon: Users,
    title: "Direct Connection",
    description:
      "Customers and workers connect without unnecessary intermediaries.",
  },
];

/* =========================================================
   HOME
========================================================= */

function Home() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [workers, setWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] =
    useState(true);
  const [workersError, setWorkersError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* =======================================================
     FETCH WORKERS
  ======================================================= */

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setWorkersLoading(true);
        setWorkersError("");

        const response = await fetch(
          `${API_URL}/workers?available=true`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to fetch workers."
          );
        }

        setWorkers(
          Array.isArray(data.workers)
            ? data.workers
            : []
        );
      } catch (error) {
        console.error(
          "FETCH WORKERS ERROR:",
          error
        );

        setWorkersError(
          error.message ||
            "Unable to load workers."
        );
      } finally {
        setWorkersLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  /* =======================================================
     FILTER WORKERS
  ======================================================= */

  const filteredWorkers = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return workers.filter((worker) => {
      const profession =
        worker.profession?.toLowerCase() || "";

      const workerName =
        worker.user?.name?.toLowerCase() || "";

      const city =
        worker.city?.toLowerCase() || "";

      const workerSkills =
        Array.isArray(worker.skills)
          ? worker.skills
              .join(" ")
              .toLowerCase()
          : "";

      const matchesSearch =
        !search ||
        profession.includes(search) ||
        workerName.includes(search) ||
        city.includes(search) ||
        workerSkills.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        profession ===
          selectedCategory.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    workers,
    searchTerm,
    selectedCategory,
  ]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = (event) => {
    event.preventDefault();

    document
      .getElementById("workers")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  /* =======================================================
     HOME BUTTON
  ======================================================= */

  const handleHomeClick = (event) => {
    event.preventDefault();

    setMobileMenuOpen(false);

    if (window.location.pathname !== "/") {
      navigate("/");
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     VIEW WORKER
  ======================================================= */

  const handleViewWorker = (workerId) => {
    if (!workerId) {
      return;
    }

    navigate(`/workers/${workerId}`);
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* ===================================================
          NAVBAR
      ================================================== */}

      <header className="navbar-glass fixed inset-x-0 top-0 z-50 border-b border-slate-200/70">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* LOGO */}

          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-slate-900">
                Skill
                <span className="text-blue-600">
                  -
                </span>
                Link
              </div>

              <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Cooperative Services
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-7 lg:flex">

            <a
              href="/"
              onClick={handleHomeClick}
              className="cursor-pointer text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Home
            </a>

            <a
              href="#workers"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Find Workers
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Pricing
            </a>

            <a
              href="#safety"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Safety
            </a>

            {isAuthenticated &&
              user?.role === "customer" && (
                <Link
                  to="/my-bookings"
                  className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                  My Bookings
                </Link>
              )}

          </nav>

          {/* DESKTOP USER */}

          <div className="hidden items-center gap-3 lg:flex">

            {isAuthenticated ? (
              <>
                <div className="mr-2 text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-[11px] font-semibold capitalize text-slate-400">
                    {user?.role || "customer"}
                  </p>
                </div>

                {user?.role === "worker" && (
                  <Link
                    to="/worker/profile"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    My Profile
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="premium-button"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            )}

          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (value) => !value
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-xl lg:hidden">

            <div className="flex flex-col gap-4">

              <a
                href="/"
                onClick={handleHomeClick}
                className="text-sm font-bold text-blue-600"
              >
                Home
              </a>

              <a
                href="#workers"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-sm font-bold text-slate-700"
              >
                Find Workers
              </a>

              <a
                href="#how-it-works"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-sm font-bold text-slate-700"
              >
                How It Works
              </a>

              <a
                href="#pricing"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-sm font-bold text-slate-700"
              >
                Pricing
              </a>

              <a
                href="#safety"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-sm font-bold text-slate-700"
              >
                Safety
              </a>

              {isAuthenticated &&
                user?.role === "customer" && (
                  <Link
                    to="/my-bookings"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="text-sm font-bold text-slate-700"
                  >
                    My Bookings
                  </Link>
                )}

              <div className="h-px bg-slate-100" />

              {isAuthenticated ? (
                <>
                  <div>
                    <p className="font-bold text-slate-900">
                      {user?.name || "User"}
                    </p>

                    <p className="text-xs capitalize text-slate-400">
                      {user?.role || "customer"}
                    </p>
                  </div>

                  {user?.role === "worker" && (
                    <Link
                      to="/worker/profile"
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className="rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-600"
                    >
                      My Profile
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="premium-button justify-center"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}

            </div>
          </div>
        )}

      </header>

      {/* ===================================================
          MAIN
      ================================================== */}

      <main>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero-background relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">

          <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="pointer-events-none absolute -right-32 top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

              {/* HERO LEFT */}

              <div>

                <div className="premium-badge inline-flex">
                  <Sparkles size={14} />
                  Fair work. Trusted services.
                </div>

                <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  Local skills.
                  <br />

                  <span className="gradient-text">
                    Direct connection.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Skill-Link connects customers directly
                  with trusted local professionals for
                  everyday services — with transparent
                  pricing and a worker-first approach.
                </p>

                {/* SEARCH */}

                <form
                  onSubmit={handleSearch}
                  className="mt-8 max-w-2xl"
                >
                  <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 sm:flex-row">

                    <div className="relative flex-1">

                      <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                          setSearchTerm(
                            event.target.value
                          )
                        }
                        placeholder="Search electrician, plumber, carpenter..."
                        className="w-full rounded-2xl border-0 bg-transparent py-4 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                      />

                    </div>

                    <button
                      type="submit"
                      className="premium-button justify-center px-7 py-3.5"
                    >
                      Find Worker
                      <ArrowRight size={17} />
                    </button>

                  </div>
                </form>

                {/* TRUST */}

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                    />
                    Verified profiles
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                    />
                    Transparent pricing
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                    />
                    Safety support
                  </div>

                </div>

              </div>

              {/* HERO RIGHT */}

              <div className="relative">

                <div className="relative rounded-4xl border border-white bg-white/80 p-5 shadow-2xl shadow-slate-300/30 backdrop-blur-xl">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Live network
                      </p>

                      <h3 className="mt-1 text-xl font-black text-slate-900">
                        Workers near you
                      </h3>
                    </div>

                    <div className="status-online">
                      <span />
                      Live
                    </div>

                  </div>

                  <div className="relative mt-5 h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-slate-100 to-violet-50">

                    <div className="absolute inset-0 opacity-40">

                      <div className="absolute left-[10%] top-[20%] h-px w-[80%] rotate-12 bg-slate-300" />

                      <div className="absolute left-[5%] top-[55%] h-px w-[90%] -rotate-12 bg-slate-300" />

                      <div className="absolute left-[30%] top-0 h-full w-px rotate-12 bg-slate-300" />

                      <div className="absolute left-[65%] top-0 h-full w-px -rotate-12 bg-slate-300" />

                    </div>

                    {/* CENTER MARKER */}

                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">

                      <div className="map-center-marker">
                        <MapPin size={22} />
                      </div>

                      <div className="mt-2 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-600 shadow">
                        Your area
                      </div>

                    </div>

                    {/* WORKER MARKERS */}

                    {[
                      {
                        left: "18%",
                        top: "25%",
                      },
                      {
                        left: "74%",
                        top: "20%",
                      },
                      {
                        left: "80%",
                        top: "65%",
                      },
                      {
                        left: "24%",
                        top: "70%",
                      },
                    ].map((point, index) => (
                      <div
                        key={index}
                        className="map-worker-marker"
                        style={{
                          left: point.left,
                          top: point.top,
                        }}
                      >
                        <BriefcaseBusiness size={14} />
                      </div>
                    ))}

                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xl font-black text-slate-900">
                        {workers.length}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Available
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xl font-black text-slate-900">
                        0%
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Platform commission
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xl font-black text-slate-900">
                        24/7
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Safety support
                      </p>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section className="border-y border-slate-100 bg-white py-8">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="flex items-center gap-3 overflow-x-auto pb-1">

              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("All")
                }
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  selectedCategory === "All"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Services
              </button>

              {categories.map((category) => {
                const Icon = category.icon;

                const active =
                  selectedCategory ===
                  category.name;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category.name
                      )
                    }
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Icon size={15} />
                    {category.name}
                  </button>
                );
              })}

            </div>
          </div>
        </section>

        {/* =================================================
            WORKERS
        ================================================= */}

        <section
          id="workers"
          className="scroll-mt-24 bg-slate-50 py-20"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Trusted professionals
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                  Find skilled workers near you
                </h2>

                <p className="mt-3 max-w-2xl text-slate-500">
                  Search real Skill-Link workers and explore their skills,
                  experience and service rates.
                </p>

              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">
                {filteredWorkers.length} worker
                {filteredWorkers.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </div>

            </div>

            {/* LOADING */}

            {workersLoading && (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="worker-card premium-card animate-pulse"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                    <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />

                    <div className="mt-6 h-20 rounded bg-slate-100" />

                    <div className="mt-6 h-12 rounded-xl bg-slate-200" />
                  </div>
                ))}

              </div>
            )}

            {/* ERROR */}

            {!workersLoading &&
              workersError && (
                <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 p-6">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <X size={18} />
                    </div>

                    <div>

                      <p className="font-bold text-red-700">
                        Unable to load workers
                      </p>

                      <p className="mt-1 text-sm text-red-500">
                        {workersError}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          window.location.reload()
                        }
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                      >
                        Try Again
                      </button>

                    </div>

                  </div>
                </div>
              )}

            {/* EMPTY */}

            {!workersLoading &&
              !workersError &&
              filteredWorkers.length === 0 && (
                <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Search size={25} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-800">
                    No workers found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Try another service, worker name or location.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"
                  >
                    Clear Filters
                  </button>

                </div>
              )}

            {/* WORKER CARDS */}

            {!workersLoading &&
              !workersError &&
              filteredWorkers.length > 0 && (
                <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">

                  {filteredWorkers.map((worker) => (
                    <article
                      key={worker._id}
                      className="worker-card premium-card flex h-full flex-col overflow-hidden"
                    >

                      {/* WORKER HEADER */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="flex h-14 w-14 min-h-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-blue-500/15">
                            {worker.user?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "W"}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-black text-slate-900">
                              {worker.user?.name ||
                                "Skill-Link Worker"}
                            </h3>

                            <p className="mt-1 truncate text-sm font-bold text-blue-600">
                              {worker.profession ||
                                "Service Professional"}
                            </p>

                          </div>

                        </div>

                        <span className="status-online shrink-0">
                          <span />
                          Available
                        </span>

                      </div>

                      {/* RATING */}

                      <div className="mt-5 flex min-h-[22px] items-center gap-3">

                        <div className="flex items-center gap-1">

                          <Star
                            size={15}
                            fill="currentColor"
                            className="shrink-0 text-amber-400"
                          />

                          <span className="text-sm font-black text-slate-700">
                            {Number(
                              worker.rating || 0
                            ).toFixed(1)}
                          </span>

                        </div>

                        <span className="text-xs text-slate-400">
                          {worker.totalReviews ||
                            0}{" "}
                          reviews
                        </span>

                        <span className="text-slate-300">
                          •
                        </span>

                        <span className="text-xs text-slate-400">
                          {worker.completedJobs ||
                            0}{" "}
                          jobs
                        </span>

                      </div>

                      {/* BIO */}

                      <div className="mt-5 min-h-[72px]">

                        <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                          {worker.bio ||
                            "Professional service provider available through Skill-Link."}
                        </p>

                      </div>

                      {/* SKILLS */}

                      <div className="min-h-[52px]">

                        {Array.isArray(
                          worker.skills
                        ) &&
                          worker.skills.length >
                            0 && (
                            <div className="flex flex-wrap gap-2">

                              {worker.skills
                                .slice(0, 3)
                                .map(
                                  (skill) => (
                                    <span
                                      key={
                                        skill
                                      }
                                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}

                              {worker.skills
                                .length >
                                3 && (
                                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                                  +
                                  {worker.skills
                                    .length -
                                    3}{" "}
                                  more
                                </span>
                              )}

                            </div>
                          )}

                      </div>

                      {/* LOCATION / RATE */}

                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

                        <div className="min-w-0 rounded-2xl bg-slate-50 p-3.5">

                          <div className="flex items-center gap-2 text-slate-400">

                            <MapPin
                              size={15}
                              className="shrink-0"
                            />

                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              Location
                            </span>

                          </div>

                          <p className="mt-2 truncate text-sm font-bold text-slate-700">
                            {worker.city ||
                              "Local area"}
                          </p>

                        </div>

                        <div className="min-w-0 rounded-2xl bg-slate-50 p-3.5">

                          <div className="flex items-center gap-2 text-slate-400">

                            <WalletCards
                              size={15}
                              className="shrink-0"
                            />

                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              Rate
                            </span>

                          </div>

                          <p className="mt-2 whitespace-nowrap text-sm font-black text-slate-900">
                            ₹
                            {worker.hourlyRate ||
                              0}

                            <span className="text-[10px] font-medium text-slate-400">
                              /hr
                            </span>
                          </p>

                        </div>

                      </div>

                      {/* VIEW PROFILE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleViewWorker(
                            worker._id
                          )
                        }
                        className="view-profile-button mt-auto flex h-[52px] min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-black text-white transition-all duration-200 hover:bg-blue-600"
                      >
                        <span>
                          View Profile
                        </span>

                        <ArrowUpRight
                          size={17}
                          className="shrink-0"
                        />
                      </button>

                    </article>
                  ))}

                </div>
              )}

          </div>
        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section
          id="how-it-works"
          className="scroll-mt-24 bg-white py-20"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Simple process
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Get the right help in minutes
              </h2>

              <p className="mt-4 text-slate-500">
                A simple customer journey designed around trust and transparency.
              </p>

            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">

              {[
                {
                  number: "01",
                  title: "Find a professional",
                  text: "Search by service, skill or location and explore available workers.",
                  icon: Search,
                },
                {
                  number: "02",
                  title: "Review & book",
                  text: "Compare profile details, skills and pricing before requesting a service.",
                  icon: CheckCircle2,
                },
                {
                  number: "03",
                  title: "Get the job done",
                  text: "Stay informed throughout the service with transparent booking information.",
                  icon: BriefcaseBusiness,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="premium-card"
                  >

                    <div className="flex items-center justify-between">

                      <div className="icon-box">
                        <Icon size={21} />
                      </div>

                      <span className="text-4xl font-black text-slate-100">
                        {item.number}
                      </span>

                    </div>

                    <h3 className="mt-7 text-xl font-black text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {item.text}
                    </p>

                  </div>
                );
              })}

            </div>
          </div>
        </section>

        {/* =================================================
            SAFETY
        ================================================= */}

        <section
          id="safety"
          className="scroll-mt-24 bg-slate-950 py-20 text-white"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-blue-200">
                  <ShieldCheck size={15} />
                  Built around trust
                </div>

                <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">
                  A safer, fairer way to{" "}
                  <span className="text-blue-400">
                    get work done.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-400">
                  Skill-Link is designed to make local service discovery more transparent for customers while creating a fairer digital marketplace for workers.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-2xl font-black text-white">
                      0%
                    </p>

                    <p className="text-xs text-slate-400">
                      Platform commission
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-2xl font-black text-white">
                      3%
                    </p>

                    <p className="text-xs text-slate-400">
                      Welfare cess
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
                    >

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Icon size={21} />
                      </div>

                      <h3 className="mt-5 font-black text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            PRICING
        ================================================= */}

        <section
          id="pricing"
          className="scroll-mt-24 bg-slate-50 py-20"
        >

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Transparent doorstep pricing
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                  Know the travel charge before you book.
                </h2>

                <p className="mt-5 leading-7 text-slate-500">
                  Skill-Link uses a simple distance-based doorstep fee so customers know the additional travel charge upfront.
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-blue-600"
                  />

                  <p className="text-sm font-semibold text-blue-800">
                    No hidden doorstep charges.
                  </p>

                </div>

              </div>

              <div className="pricing-grid">

                {pricing.map((item) => (
                  <div
                    key={item.distance}
                    className="pricing-card"
                  >

                    <div className="pricing-card-left">

                      <p className="pricing-label">
                        Distance
                      </p>

                      <p className="pricing-distance">
                        {item.distance}
                      </p>

                    </div>

                    <div className="pricing-price">
                      {item.price}
                    </div>

                  </div>
                ))}

              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="bg-white py-20">

          <div className="mx-auto max-w-5xl px-5 lg:px-8">

            <div className="cta-section">

              <div className="cta-glow" />

              <div className="cta-content">

                <div className="cta-text">

                  <div className="cta-small-badge">
                    <Sparkles size={13} />
                    <span>Skill-Link</span>
                  </div>

                  <h2 className="cta-title">
                    Ready to connect with local skills?
                  </h2>

                  <p className="cta-description">
                    Find a professional for your next service
                    or create your worker profile and start
                    offering your skills.
                  </p>

                </div>

                {/* CLICKABLE GET STARTED */}

                <Link
                  to="/register"
                  className="cta-get-started"
                  aria-label="Get Started"
                >
                  <span>Get Started</span>

                  <ArrowRight
                    size={17}
                    className="cta-arrow"
                  />
                </Link>

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div>

              <Link
                to="/"
                onClick={handleHomeClick}
                className="flex items-center gap-3"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                  <BriefcaseBusiness size={19} />
                </div>

                <div>

                  <p className="font-black text-slate-900">
                    Skill
                    <span className="text-blue-600">
                      -
                    </span>
                    Link
                  </p>

                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Cooperative Services
                  </p>

                </div>

              </Link>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Connecting customers and local professionals through a transparent and worker-first service platform.
              </p>

            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">

              <a
                href="#workers"
                className="hover:text-blue-600"
              >
                Find Workers
              </a>

              <a
                href="#how-it-works"
                className="hover:text-blue-600"
              >
                How It Works
              </a>

              <a
                href="#pricing"
                className="hover:text-blue-600"
              >
                Pricing
              </a>

              <a
                href="#safety"
                className="hover:text-blue-600"
              >
                Safety
              </a>

            </div>

          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Skill-Link. Built for fair and transparent local services.
            </p>

          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;