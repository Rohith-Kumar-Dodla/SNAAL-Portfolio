import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
vi.mock("./services/api", async () => {
  const content = await import("./data/content");
  const service = (x) => ({ ...x, name: x.title, summary: x.short, process: x.approach });
  const project = (x) => ({ ...x, name: x.title, shortDescription: x.summary, architecture: x.engineering, results: [x.outcome] });
  const article = (x) => ({ ...x, content: x.body, readingTime: Number.parseInt(x.readTime), publishedAt: new Date(x.date).toISOString() });
  const technologies = content.technologyGroups.flatMap((group,index) => group.items.map((name,itemIndex) => ({name,slug:"test-"+index+"-"+itemIndex,category:group.name.toLowerCase().includes("front")?"frontend":group.name.toLowerCase().includes("back")?"backend":group.name.toLowerCase().includes("mobile")?"mobile":"data",description:group.description})));
  const fixture = (path) => path.startsWith("/services")?content.services.map(service):path.startsWith("/projects")?content.projects.map(project):path.startsWith("/technologies")?technologies:path.startsWith("/insights")?content.insights.map(article):path.startsWith("/testimonials")?[]:path.startsWith("/site-content")?[{key:"home",sections:{hero:{eyebrow:"Digital product & technology partner",title:"Technology built around your business.",description:content.company.description},process:content.process,industries:content.industries,differentiators:content.differentiators.map(({title,copy})=>({title,copy}))}}]:path.startsWith("/site-settings")?{companyName:content.company.name,defaultSeo:{description:content.company.description}}:{};
  return { getData: vi.fn((path) => Promise.resolve(fixture(path))), submitContact: vi.fn(), submitSiteVisit: vi.fn() };
});
const renderApp = (path = "/") =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  );
describe("global public experience", () => {
  it("renders the application and navigation", async () => {
    renderApp();
    expect(
      await screen.findByRole("heading", { name: /technology built around/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
  });
  it("opens and closes mobile navigation with Escape", async () => {
    const user = userEvent.setup();
    renderApp();
    const toggle = screen.getByRole("button", { name: /toggle navigation/i });
    await user.click(toggle);
    expect(
      screen.getByRole("navigation", { name: "Mobile" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.queryByRole("navigation", { name: "Mobile" }),
      ).not.toBeInTheDocument(),
    );
  });
  it("renders branded 404", async () => {
    renderApp("/missing-page");
    expect(
      await screen.findByRole("heading", { name: /this page isn’t here/i }),
    ).toBeInTheDocument();
  });
});
describe("home", () => {
  it("renders important sections and CTAs", async () => {
    renderApp();
    expect(
      await screen.findByRole("heading", { name: /capability organized/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /product decisions brought to life/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore our work/i }),
    ).toHaveAttribute("href", "/portfolio");
    expect(
      screen.getAllByRole("link", { name: /start a conversation/i })[0],
    ).toHaveAttribute("href", "/contact");
  });
});
describe("services", () => {
  it("renders service listing", async () => {
    renderApp("/services");
    expect(
      await screen.findByRole("heading", { name: /focused capability/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Web Application Development").length,
    ).toBeGreaterThan(0);
  });
  it("renders valid detail", async () => {
    renderApp("/services/web-application-development");
    expect(
      await screen.findByRole("heading", {
        name: "Web Application Development",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /built around the problem/i }),
    ).toBeInTheDocument();
  });
  it("handles invalid service", async () => {
    renderApp("/services/not-real");
    expect(
      await screen.findByText(/could not find this service/i),
    ).toBeInTheDocument();
  });
});
describe("portfolio", () => {
  it("renders and filters projects", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    expect(
      (await screen.findAllByText("Operations Command Center")).length,
    ).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "AI" }));
    expect(
      await screen.findByText("Knowledge Automation Workbench"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText("Operations Command Center"),
      ).not.toBeInTheDocument(),
    );
  });
  it("renders valid project without an unverified live link", async () => {
    renderApp("/portfolio/operations-command-center");
    expect(
      await screen.findByRole("heading", { name: "Operations Command Center" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /architecture that explains itself/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view live project/i }),
    ).not.toBeInTheDocument();
  });
  it("handles invalid project", async () => {
    renderApp("/portfolio/not-real");
    expect(
      await screen.findByText(/could not find this case study/i),
    ).toBeInTheDocument();
  });
});
describe("technologies and insights", () => {
  it("renders technology categories", async () => {
    renderApp("/technologies");
    expect(
      await screen.findByRole("heading", { name: /tools chosen/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Frontend" }),
    ).toBeInTheDocument();
  });
  it("renders insights listing and detail", async () => {
    renderApp("/insights");
    expect(
      await screen.findByText(
        "Designing software around the work people actually do",
      ),
    ).toBeInTheDocument();
  });
  it("renders valid insight detail", async () => {
    renderApp("/insights/designing-software-around-real-work");
    expect(
      await screen.findByRole("heading", { name: "Start with the operation" }),
    ).toBeInTheDocument();
  });
  it("handles invalid insight", async () => {
    renderApp("/insights/not-real");
    expect(
      await screen.findByText(/could not find this insight/i),
    ).toBeInTheDocument();
  });
});
describe("forms", () => {
  it("shows contact required-field errors without pretending to submit", async () => {
    const user = userEvent.setup();
    renderApp("/contact");
    await user.click(
      await screen.findByRole("button", { name: /validate enquiry/i }),
    );
    expect(screen.getAllByText("This field is required.")).toHaveLength(3);
    expect(screen.queryByText(/form is complete/i)).not.toBeInTheDocument();
  });
  it("shows site visit required-field errors", async () => {
    const user = userEvent.setup();
    renderApp("/book-site-visit");
    await user.click(
      await screen.findByRole("button", { name: /validate request/i }),
    );
    expect(
      screen.getAllByText("This field is required.").length,
    ).toBeGreaterThan(5);
  });
});
