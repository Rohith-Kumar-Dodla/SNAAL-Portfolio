import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../services/api";
export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin" replace />;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await login({ email: form.get("email"), password: form.get("password") });
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-ink p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 font-display text-xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600">
            S
          </span>
          SNAAL Admin
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-300">
            Secure workspace
          </p>
          <h1 className="mt-5 max-w-lg font-display text-5xl font-bold leading-tight tracking-[-.04em]">
            Manage the work behind the experience.
          </h1>
          <p className="mt-6 max-w-md leading-7 text-slate-300">
            A focused control center for published content, media and client
            operations.
          </p>
        </div>
        <p className="text-xs text-slate-400">SNAAL Info Private Limited</p>
      </section>
      <section className="grid place-items-center bg-canvas p-5">
        <form
          className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-10"
          onSubmit={submit}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <LockKeyhole />
          </span>
          <h1 className="mt-7 font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to the SNAAL administration workspace.
          </p>
          <label className="mt-8 block text-sm font-semibold">
            Email
            <input
              name="email"
              required
              className="admin-input"
              type="email"
              autoComplete="username"
            />
          </label>
          <label className="mt-5 block text-sm font-semibold">
            Password
            <input
              name="password"
              required
              className="admin-input"
              type="password"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"} <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}
