import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  BriefcaseBusiness,
  History,
  LogOut,
  FileText,
  Gauge,
  Image,
  Layers3,
  Menu,
  MessageSquareText,
  Settings,
  Users,
  Workflow,
  X,
} from "lucide-react";
const items = [
  ["Dashboard", "/admin", Gauge],
  ["Projects", "/admin/projects", BriefcaseBusiness],
  ["Services", "/admin/services", Layers3],
  ["Technologies", "/admin/technologies", Workflow],
  ["Insights", "/admin/insights", FileText],
  ["Testimonials", "/admin/testimonials", MessageSquareText],
  ["Leads", "/admin/leads", MessageSquareText],
  ["Site visits", "/admin/site-visits", BarChart3],
  ["Team", "/admin/team", Users],
  ["Media", "/admin/media", Image],
  ["Content", "/admin/content", FileText],
  ["Settings", "/admin/settings", Settings],
  ["Activity", "/admin/activity", History],
];
function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-ink text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display font-bold">
            S
          </span>
          <span className="font-display font-bold">
            SNAAL <i className="ml-1 text-xs not-italic text-blue-300">Admin</i>
          </span>
        </div>
        <button
          className="lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X />
        </button>
      </div>
      <nav
        className="h-[calc(100vh-80px)] overflow-y-auto p-4"
        aria-label="Admin"
      >
        {items.map(([label, to, Icon]) => (
          <NavLink
            end={to === "/admin"}
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
export default function AdminShell() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && (
        <button
          className="fixed inset-0 z-30 bg-ink/45 lg:hidden"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur sm:px-7">
          <button
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line lg:hidden"
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <p className="hidden text-sm text-muted sm:block">
            Content & operations workspace
          </p>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs capitalize text-muted">{user?.role?.replace("_", " ")}</p>
            </div>
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700" aria-label="Sign out"><LogOut size={18}/></button>
          </div>
        </header>
        <main className="mx-auto max-w-page p-4 sm:p-7 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
