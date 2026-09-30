import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SiteLayout from "./components/SiteLayout";
import { Loading } from "./components/ui";
import { ContentProvider } from "./context/ContentContext";
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() =>
  import("./pages/Services").then((m) => ({ default: m.Services })),
);
const ServiceDetail = lazy(() =>
  import("./pages/Services").then((m) => ({ default: m.ServiceDetail })),
);
const Portfolio = lazy(() =>
  import("./pages/Portfolio").then((m) => ({ default: m.Portfolio })),
);
const ProjectDetail = lazy(() =>
  import("./pages/Portfolio").then((m) => ({ default: m.ProjectDetail })),
);
const Technologies = lazy(() => import("./pages/Technologies"));
const Insights = lazy(() =>
  import("./pages/Insights").then((m) => ({ default: m.Insights })),
);
const InsightDetail = lazy(() =>
  import("./pages/Insights").then((m) => ({ default: m.InsightDetail })),
);
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
export default function App() {
  const location = useLocation();
  return (
    <ContentProvider>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loading />}>
          <Routes location={location} key={location.pathname}>
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="portfolio/:slug" element={<ProjectDetail />} />
              <Route path="technologies" element={<Technologies />} />
              <Route path="insights" element={<Insights />} />
              <Route path="insights/:slug" element={<InsightDetail />} />
              <Route path="contact" element={<Contact mode="contact" />} />
              <Route
                path="book-site-visit"
                element={<Contact mode="visit" />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ContentProvider>
  );
}
