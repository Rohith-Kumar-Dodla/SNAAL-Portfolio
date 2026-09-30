import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminShell from "./components/AdminShell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResourcePage from "./pages/ResourcePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Loading } from "./components/ui";
const pages = [
  "projects",
  "services",
  "technologies",
  "insights",
  "testimonials",
  "leads",
  "site-visits",
  "team",
  "media",
  "content",
  "settings",
  "activity",
];
function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <main className="grid min-h-screen place-items-center">
        <Loading />
      </main>
    );
  return user ? (
    children
  ) : (
    <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  );
}
function RoutesView() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminShell />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        {pages.map((page) => (
          <Route
            key={page}
            path={page}
            element={<ResourcePage type={page} />}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <RoutesView />
    </AuthProvider>
  );
}
