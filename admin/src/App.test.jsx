import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const auth = vi.hoisted(() => ({
  user: { name: "Test Admin", role: "admin" },
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("./context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => auth,
}));

vi.mock("./services/api", () => {
  const response = (value) => Promise.resolve({ data: { data: value } });
  const media = [{
    _id: "507f1f77bcf86cd799439011",
    publicId: "snaal/projects/acceptance",
    secureUrl: "https://res.cloudinary.com/demo/image/upload/acceptance.png",
    alt: "Acceptance image",
    folder: "projects",
    width: 1200,
    height: 800,
    bytes: 2000,
  }];
  return {
    api: {
      get: vi.fn((url) => response(
        url === "/admin/dashboard"
          ? { metrics: { projects: 0, publishedProjects: 0, draftProjects: 0, services: 0, technologies: 0, publishedInsights: 0, newLeads: 0, activeVisits: 0, mediaAssets: 0 }, recentLeads: [], recentVisits: [], recentActivity: [] }
          : url.startsWith("/admin/media") ? media : [],
      )),
      post: vi.fn(() => response({})),
      patch: vi.fn(() => response({})),
      put: vi.fn(() => response({})),
      delete: vi.fn(() => response({})),
    },
    data: (promise) => promise.then((result) => result.data.data),
    apiError: () => "Request failed",
  };
});

const renderApp = (path) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

beforeEach(() => {
  auth.user = { name: "Test Admin", role: "admin" };
  auth.loading = false;
});

describe("admin app", () => {
  it("renders live dashboard shell", async () => {
    renderApp("/admin");
    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByText("Total projects")).toBeInTheDocument();
  });

  it("renders CMS resource route and create action", async () => {
    renderApp("/admin/projects");
    expect(await screen.findByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create new/i })).toBeInTheDocument();
  });

  it("selects and clears structured media in the visual picker", async () => {
    const user = userEvent.setup();
    renderApp("/admin/projects");
    await user.click(await screen.findByRole("button", { name: /create new/i }));
    await user.click(screen.getAllByRole("button", { name: /choose media/i })[0]);
    await user.click(await screen.findByRole("button", { name: /acceptance image/i }));
    expect(screen.getAllByRole("button", { name: "Replace" })[0]).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear thumbnail/i }));
    expect(screen.getAllByRole("button", { name: /choose media/i })[0]).toBeInTheDocument();
  });

  it("accepts a file in the drag-and-drop upload control", async () => {
    const user = userEvent.setup();
    renderApp("/admin/media");
    const input = document.querySelector('input[type="file"]');
    await user.upload(input, new File(["image"], "project.png", { type: "image/png" }));
    expect(await screen.findByText("project.png")).toBeInTheDocument();
  });

  it("renders login and accepts credentials", async () => {
    auth.user = null;
    renderApp("/admin/login");
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Email"), "admin@example.com");
    expect(screen.getByLabelText("Email")).toHaveValue("admin@example.com");
  });

  it("redirects unauthenticated protected routes", async () => {
    auth.user = null;
    renderApp("/admin/projects");
    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });
});
