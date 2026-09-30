import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api/workers";

const defaultProfile = {
  profession: "",
  phone: "",
  city: "",
  bio: "",
  skills: "",
  experience: "",
  hourlyRate: "",
  serviceRadius: "10",
  isAvailable: true,
};

function WorkerProfile() {
  const navigate = useNavigate();

  const {
    user,
    token,
    isAuthenticated,
  } = useAuth();

  const [profile, setProfile] = useState(defaultProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role !== "worker") {
      navigate("/", { replace: true });
      return;
    }

    if (!token) {
      setLoading(false);
      setError(
        "Authentication token is missing. Please logout and login again."
      );
      return;
    }

    loadProfile();
  }, [
    isAuthenticated,
    user?.role,
    token,
    navigate,
  ]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // IMPORTANT:
      // Actual backend route:
      // GET /api/workers/profile/me

      const response = await fetch(
        `${API_URL}/profile/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "PROFILE GET STATUS:",
        response.status
      );

      console.log(
        "PROFILE GET RESPONSE:",
        data
      );

      // Profile doesn't exist yet
      if (response.status === 404) {
        setProfile({
          ...defaultProfile,
          phone: user?.phone || "",
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load worker profile."
        );
      }

      const worker =
        data?.worker ||
        data?.profile;

      if (!worker) {
        setProfile({
          ...defaultProfile,
          phone: user?.phone || "",
        });

        return;
      }

      setProfile({
        profession:
          worker.profession || "",

        phone:
          worker.phone ||
          worker.user?.phone ||
          user?.phone ||
          "",

        city:
          worker.city || "",

        bio:
          worker.bio || "",

        skills:
          Array.isArray(worker.skills)
            ? worker.skills.join(", ")
            : worker.skills || "",

        experience:
          worker.experience || "",

        hourlyRate:
          worker.hourlyRate !== undefined &&
          worker.hourlyRate !== null
            ? String(worker.hourlyRate)
            : "",

        serviceRadius:
          worker.serviceRadius !== undefined &&
          worker.serviceRadius !== null
            ? String(worker.serviceRadius)
            : "10",

        isAvailable:
          worker.isAvailable !== undefined
            ? worker.isAvailable
            : true,
      });
    } catch (err) {
      console.error(
        "PROFILE LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your worker profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  // =====================================================
  // AVAILABILITY
  // =====================================================

  const handleAvailability = () => {
    setProfile((current) => ({
      ...current,
      isAvailable:
        !current.isAvailable,
    }));

    setSaved(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    setSaved(false);
    setError("");

    if (!token) {
      setError(
        "Authentication token is missing. Please logout and login again."
      );
      return;
    }

    // Basic validation

    if (!profile.profession.trim()) {
      setError(
        "Please select your profession."
      );
      return;
    }

    if (!profile.city.trim()) {
      setError(
        "Please enter your city."
      );
      return;
    }

    if (
      profile.hourlyRate !== "" &&
      Number(profile.hourlyRate) < 0
    ) {
      setError(
        "Hourly rate cannot be negative."
      );
      return;
    }

    if (
      profile.serviceRadius !== "" &&
      (
        Number(profile.serviceRadius) < 1 ||
        Number(profile.serviceRadius) > 100
      )
    ) {
      setError(
        "Service radius must be between 1 and 100 km."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        profession:
          profile.profession.trim(),

        phone:
          profile.phone.trim(),

        city:
          profile.city.trim(),

        bio:
          profile.bio.trim(),

        skills:
          profile.skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean),

        experience:
          profile.experience.trim(),

        hourlyRate:
          profile.hourlyRate === ""
            ? 0
            : Number(
                profile.hourlyRate
              ),

        serviceRadius:
          profile.serviceRadius === ""
            ? 10
            : Number(
                profile.serviceRadius
              ),

        isAvailable:
          profile.isAvailable,
      };

      console.log(
        "PROFILE SAVE PAYLOAD:",
        payload
      );

      // IMPORTANT:
      // Actual backend route:
      // POST /api/workers/profile

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      console.log(
        "PROFILE SAVE STATUS:",
        response.status
      );

      console.log(
        "PROFILE SAVE RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save worker profile."
        );
      }

      const worker =
        data?.worker ||
        data?.profile;

      // Update UI with returned data

      if (worker) {
        setProfile({
          profession:
            worker.profession || "",

          phone:
            worker.phone ||
            worker.user?.phone ||
            profile.phone ||
            "",

          city:
            worker.city || "",

          bio:
            worker.bio || "",

          skills:
            Array.isArray(
              worker.skills
            )
              ? worker.skills.join(
                  ", "
                )
              : worker.skills || "",

          experience:
            worker.experience || "",

          hourlyRate:
            worker.hourlyRate !==
              undefined &&
            worker.hourlyRate !==
              null
              ? String(
                  worker.hourlyRate
                )
              : "",

          serviceRadius:
            worker.serviceRadius !==
              undefined &&
            worker.serviceRadius !==
              null
              ? String(
                  worker.serviceRadius
                )
              : "10",

          isAvailable:
            worker.isAvailable !==
              undefined
              ? worker.isAvailable
              : profile.isAvailable,
        });
      }

      // Success

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 5000);
    } catch (err) {
      console.error(
        "PROFILE SAVE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UPDATE AVAILABILITY
  // =====================================================

  const handleAvailabilitySave = async () => {
    if (!token) {
      setError(
        "Authentication token is missing. Please login again."
      );
      return;
    }

    const newAvailability =
      !profile.isAvailable;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/availability`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            isAvailable:
              newAvailability,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update availability."
        );
      }

      setProfile((current) => ({
        ...current,
        isAvailable:
          newAvailability,
      }));

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "AVAILABILITY ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to update availability."
      );
    }
  };

  // =====================================================
  // AUTH CHECK
  // =====================================================

  if (
    !isAuthenticated ||
    user?.role !== "worker"
  ) {
    return null;
  }

  // =====================================================
  // INITIALS
  // =====================================================

  const initials =
    user?.name
      ?.split(" ")
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "W";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">

            <Loader2
              size={28}
              className="animate-spin text-blue-600"
            />

          </div>

          <p className="mt-4 text-sm font-bold text-slate-700">
            Loading your profile...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching your Skill-Link profile
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">

              <BriefcaseBusiness
                size={21}
              />

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
            onClick={() =>
              navigate(
                "/worker/dashboard"
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >

            <ArrowLeft
              size={17}
            />

            Dashboard

          </button>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-4xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-7 text-white shadow-xl shadow-blue-500/10 sm:p-9">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-2xl font-black text-blue-700 shadow-xl">
                {initials}
              </div>

              <div>

                <p className="text-sm font-semibold text-blue-100">
                  Worker account
                </p>

                <h1 className="mt-1 text-3xl font-black">
                  {user?.name ||
                    "Worker"}
                </h1>

                <p className="mt-1 text-sm text-blue-100">
                  {user?.email}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={
                handleAvailabilitySave
              }
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                profile.isAvailable
                  ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                  : "bg-white/15 text-white hover:bg-white/20"
              }`}
            >

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  profile.isAvailable
                    ? "bg-emerald-700"
                    : "bg-slate-300"
                }`}
              />

              {profile.isAvailable
                ? "Available for bookings"
                : "Currently offline"}

            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">

            <div className="flex items-start gap-3">

              <X
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                {error}
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="shrink-0 text-red-400 transition hover:text-red-700"
            >
              <X size={17} />
            </button>

          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Professional details
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Complete your profile
                </h2>

              </div>

              <div className="hidden rounded-xl bg-blue-50 p-3 text-blue-600 sm:block">

                <UserRound
                  size={21}
                />

              </div>

            </div>

            {/* =================================================
                FORM GRID
            ================================================= */}

            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              {/* Profession */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Profession
                </label>

                <div className="relative">

                  <Wrench
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="profession"
                    value={
                      profile.profession
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option value="">
                      Select profession
                    </option>

                    <option value="Electrician">
                      Electrician
                    </option>

                    <option value="Plumber">
                      Plumber
                    </option>

                    <option value="Carpenter">
                      Carpenter
                    </option>

                    <option value="Painter">
                      Painter
                    </option>

                    <option value="AC Technician">
                      AC Technician
                    </option>

                    <option value="Cleaner">
                      Cleaner
                    </option>

                    <option value="Mechanic">
                      Mechanic
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Phone
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="phone"
                    type="tel"
                    value={
                      profile.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* City */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  City
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="city"
                    type="text"
                    value={
                      profile.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Chandigarh"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Experience */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Experience
                </label>

                <div className="relative">

                  <Clock3
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="experience"
                    type="text"
                    value={
                      profile.experience
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="5 years"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Hourly Rate */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Hourly Rate (₹)
                </label>

                <div className="relative">

                  <WalletCards
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="hourlyRate"
                    type="number"
                    min="0"
                    value={
                      profile.hourlyRate
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="500"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Service Radius */}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Service Radius (km)
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="serviceRadius"
                    type="number"
                    min="1"
                    max="100"
                    value={
                      profile.serviceRadius
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                SKILLS
            ================================================= */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Skills
              </label>

              <input
                name="skills"
                type="text"
                value={
                  profile.skills
                }
                onChange={
                  handleChange
                }
                placeholder="Wiring, switch repair, fan installation"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <p className="mt-2 text-xs text-slate-400">
                Add multiple skills separated by commas.
              </p>

            </div>

            {/* =================================================
                BIO
            ================================================= */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-bold text-slate-700">
                About your service
              </label>

              <textarea
                name="bio"
                value={
                  profile.bio
                }
                onChange={
                  handleChange
                }
                rows={5}
                maxLength={1000}
                placeholder="Tell customers about your experience, services and what makes your work reliable..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {profile.bio.length}/1000
              </p>

            </div>

            {/* =================================================
                SAVE
            ================================================= */}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-400">
                Your profile details are saved in MongoDB.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="premium-button inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save
                      size={17}
                    />

                    Save Profile
                  </>
                )}

              </button>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {saved && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">

                <CheckCircle2
                  size={19}
                />

                <div>

                  <p>
                    Profile saved successfully!
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-emerald-600">
                    Your worker profile has been updated successfully.
                  </p>

                </div>

              </div>
            )}

          </form>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-5">

            {/* Trust */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                <ShieldCheck
                  size={23}
                />

              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                Build customer trust
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A complete profile helps customers understand your skills, experience, service area and rate.
              </p>

              <div className="mt-5 space-y-3">

                {[
                  "Professional details",
                  "Skills and experience",
                  "Transparent hourly rate",
                  "Service availability",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                  >

                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                    />

                    {item}

                  </div>
                ))}

              </div>

            </div>

            {/* Availability */}

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Profile status
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {profile.isAvailable
                  ? "Available"
                  : "Offline"}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {profile.isAvailable
                  ? "Customers can see you as available for new service requests."
                  : "You are currently not accepting new service requests."}
              </p>

              <button
                type="button"
                onClick={
                  handleAvailabilitySave
                }
                className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-100"
              >
                {profile.isAvailable
                  ? "Go Offline"
                  : "Go Available"}
              </button>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default WorkerProfile;