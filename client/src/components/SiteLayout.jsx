import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "./ui";
import { ContentStatus, useContent } from "../context/ContentContext";
const navigation = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Technologies", "/technologies"],
  ["Insights", "/insights"],
  ["Contact", "/contact"],
];
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="SNAAL home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-sm font-extrabold text-white">
        S
      </span>
      <span className="font-display text-lg font-extrabold tracking-[-.04em]">
        SNAAL<span className="text-brand-600">.</span>
      </span>
    </Link>
  );
}
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", close);
    };
  }, [open]);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${scrolled ? "border-line bg-white/95 py-3 shadow-sm backdrop-blur" : "border-transparent bg-white/85 py-5 backdrop-blur-sm"}`}
    >
      <div className="page-container flex items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navigation.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition ${isActive ? "text-brand-700" : "text-slate-600 hover:text-ink"}`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav"
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded bg-brand-600"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button to="/book-site-visit">
            Book a Site Visit <ArrowUpRight size={16} />
          </Button>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-full h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-white px-4 py-8 lg:hidden"
          >
            <nav
              className="mx-auto flex max-w-page flex-col"
              aria-label="Mobile"
            >
              {navigation.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `border-b border-line px-2 py-4 font-display text-2xl font-semibold ${isActive ? "text-brand-600" : "text-ink"}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Button to="/book-site-visit" className="mt-7">
                Book a Site Visit
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
function Footer() {
  const { services, technologyGroups, settings, siteContent } = useContent();
  const footer = siteContent.footer || {};
  return (
    <footer className="border-t border-line bg-[#f6f9fd]">
      <div className="page-container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm leading-7 text-muted">
              {footer.description || ""}
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
            >
              Start a conversation <ArrowUpRight size={15} />
            </Link>
          </div>
          <div>
            <p className="text-sm font-bold">Navigate</p>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              {navigation.slice(1).map(([l, t]) => (
                <Link key={t} to={t} className="hover:text-brand-700">
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">Services</p>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              {services.slice(0, 4).map((x) => (
                <Link
                  key={x.slug}
                  to={`/services/${x.slug}`}
                  className="hover:text-brand-700"
                >
                  {x.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">Technology</p>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              {technologyGroups.slice(0, 4).map((x) => (
                <Link
                  key={x.name}
                  to="/technologies"
                  className="hover:text-brand-700"
                >
                  {x.name}
                </Link>
              ))}
            </div>
            <p className="mt-7 text-xs leading-5 text-muted">
              {settings.publicEmail || settings.publicPhone || ""}
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.companyName || "SNAAL"}.
          </span>
          <span>Privacy · Terms · Social links pending verification</span>
        </div>
      </div>
    </footer>
  );
}
function RouteSeo() {
  const { services, projects, insights, settings } = useContent();
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  let title = "Technology built around your business";
  let description = settings.defaultSeo?.description || "";
  if (pathname === "/about") title = "About";
  else if (pathname === "/services") title = "Services";
  else if (pathname === "/portfolio") title = "Portfolio";
  else if (pathname === "/technologies") title = "Technologies";
  else if (pathname === "/insights") title = "Insights";
  else if (pathname === "/contact") title = "Contact";
  else if (pathname === "/book-site-visit") title = "Book a Site Visit";
  else if (segments[0] === "services") {
    const item = services.find((x) => x.slug === segments[1]);
    if (item) {
      title = item.title;
      description = item.short;
    }
  } else if (segments[0] === "portfolio") {
    const item = projects.find((x) => x.slug === segments[1]);
    if (item) {
      title = item.title;
      description = item.description;
    }
  } else if (segments[0] === "insights") {
    const item = insights.find((x) => x.slug === segments[1]);
    if (item) {
      title = item.title;
      description = item.excerpt;
    }
  }
  const fullTitle = pathname === "/" ? `SNAAL — ${title}` : `${title} — SNAAL`;
  const base = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {base && <link rel="canonical" href={`${base}${pathname}`} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta
        property="og:type"
        content={
          segments[0] === "insights" && segments[1] ? "article" : "website"
        }
      />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
}
export default function SiteLayout() {
  return (
    <>
      <RouteSeo />
      <Navbar />
      <ContentStatus />
      <Outlet />
      <Footer />
    </>
  );
}
