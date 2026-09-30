import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
        AuthContext login should return the logged-in user.
        Expected:
        {
          token: "...",
          user: {
            name,
            email,
            role
          }
        }
      */

      const result = await login(
        form.email.trim().toLowerCase(),
        form.password
      );

      console.log("LOGIN RESULT:", result);

      /*
        Worker -> Worker Dashboard
        Customer -> previous page/Home
      */

      const loggedInUser = result?.user || result;

      if (loggedInUser?.role === "worker") {
        navigate("/worker/dashboard", {
          replace: true,
        });

        return;
      }

      const from =
        location.state?.from &&
        location.state.from !== "/login"
          ? location.state.from
          : "/";

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.message ||
          "Unable to login. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <p className="text-lg font-black text-slate-900">
                Skill
                <span className="text-blue-600">
                  -Link
                </span>
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Cooperative Services
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        {/* Background decorations */}

        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 lg:grid-cols-2">
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <section className="relative hidden overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-10 text-white lg:flex lg:min-h-162.5 lg:flex-col lg:justify-between">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-sm">
                <Sparkles size={14} />
                Welcome back
              </div>

              <h1 className="mt-8 max-w-lg text-5xl font-black leading-tight">
                Connect with
                <br />
                local skills.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
                Login to Skill-Link and manage your
                services, bookings, and professional
                connections from one place.
              </p>
            </div>

            <div className="relative space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="font-bold">
                    Trusted professionals
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Connect directly with verified local
                    workers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <BriefcaseBusiness size={21} />
                </div>

                <div>
                  <p className="font-bold">
                    Simple booking
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Manage your service requests easily.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              LOGIN FORM
          ================================================== */}

          <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              {/* Mobile logo */}

              <div className="mb-8 lg:hidden">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                  <BriefcaseBusiness size={25} />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-blue-600">
                  Skill-Link
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Login to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter your details to continue.
                </p>
              </div>

              {/* Error */}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Register */}

              <div className="mt-8 border-t border-slate-100 pt-7 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-black text-blue-600 transition hover:text-blue-700"
                >
                  Create an account
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Bottom note */}

              <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <ShieldCheck size={14} />
                Secure Skill-Link authentication
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;