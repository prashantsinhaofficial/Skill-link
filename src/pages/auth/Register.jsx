import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api/auth";

function Register() {
  const navigate = useNavigate();

  // Auth Context
  const { login } = useAuth();

  // Form states
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      // -----------------------------
      // Save authentication
      // -----------------------------

      login(data.token, data.user);

      setSuccess(
        "Account created successfully! Redirecting..."
      );

      // -----------------------------
      // Redirect
      // -----------------------------

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the server. Make sure the backend is running."
        );
      } else {
        setError(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <p className="font-black text-slate-900">
                Skill<span className="text-blue-600">-</span>Link
              </p>

              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Cooperative Services
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 lg:grid-cols-2">
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="hidden bg-linear-to-br from-blue-700 via-indigo-700 to-violet-700 p-10 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <BriefcaseBusiness size={28} />
                </div>

                <h1 className="mt-8 text-4xl font-black leading-tight">
                  Connect with
                  <br />
                  local skills.
                </h1>

                <p className="mt-5 max-w-sm leading-7 text-blue-100">
                  Join Skill-Link and discover a trusted community
                  of customers and skilled professionals.
                </p>
              </div>

              <div className="mt-12 space-y-4">
                {[
                  "Verified worker profiles",
                  "Transparent service pricing",
                  "Secure booking system",
                  "Safety and SOS support",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-blue-50"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-300"
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              {/* Heading */}

              <div>
                <p className="text-sm font-bold text-blue-600">
                  Create account
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Join Skill-Link
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Create your account and get started.
                </p>
              </div>

              {/* =================================================
                  ROLE SELECTOR
              ================================================== */}

              <div className="mt-7 grid grid-cols-2 gap-3">
                {/* Customer */}

                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    role === "customer"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <User size={20} />

                    {role === "customer" && (
                      <CheckCircle2 size={17} />
                    )}
                  </div>

                  <p className="mt-3 text-sm font-black">
                    Customer
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Find skilled workers
                  </p>
                </button>

                {/* Worker */}

                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    role === "worker"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <BriefcaseBusiness size={20} />

                    {role === "worker" && (
                      <CheckCircle2 size={17} />
                    )}
                  </div>

                  <p className="mt-3 text-sm font-black">
                    Worker
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Offer your skills
                  </p>
                </button>
              </div>

              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{error}</p>
                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================== */}

              {success && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-600">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{success}</p>
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >
                {/* Name */}

                <div>
                  <label
                    htmlFor="register-name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="premium-input pl-11"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="premium-input pl-11"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="register-password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      className="premium-input px-11"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="premium-button w-full gap-2 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account

                      <ArrowLeft
                        size={18}
                        className="rotate-180"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}

              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
              </p>

              {/* Terms */}

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
                By creating an account, you agree to Skill-Link&apos;s
                terms and service policies.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;