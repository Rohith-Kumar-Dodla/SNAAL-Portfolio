import { useEffect, useState } from "react";
import { Card, MetricCard, PageHeader, Loading } from "../components/ui";
import { api, data, apiError } from "../services/api";
export default function Dashboard() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  useEffect(() => {
    data(api.get("/admin/dashboard"))
      .then((value) => setState({ loading: false, error: "", data: value }))
      .catch((error) =>
        setState({ loading: false, error: apiError(error), data: null }),
      );
  }, []);
  if (state.loading) return <Loading />;
  if (state.error)
    return (
      <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
        {state.error}
      </p>
    );
  const { metrics, recentLeads, recentVisits, recentActivity } = state.data;
  const cards = [
    ["Total projects", metrics.projects],
    ["Published projects", metrics.publishedProjects],
    ["Draft projects", metrics.draftProjects],
    ["Services", metrics.services],
    ["Technologies", metrics.technologies],
    ["Published insights", metrics.publishedInsights],
    ["New leads", metrics.newLeads],
    ["Active visits", metrics.activeVisits],
    ["Media assets", metrics.mediaAssets],
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Live content and client activity from MongoDB."
        action={false}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            note="Live database count"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Recent
          title="Recent leads"
          items={recentLeads.map((x) => ({
            title: x.name,
            detail: x.email,
            date: x.createdAt,
          }))}
        />
        <Recent
          title="Recent site visits"
          items={recentVisits.map((x) => ({
            title: x.company,
            detail: x.status,
            date: x.createdAt,
          }))}
        />
        <Recent
          title="Recent activity"
          items={recentActivity.map((x) => ({
            title: x.action,
            detail: x.actor?.name || "Administrator",
            date: x.createdAt,
          }))}
        />
      </div>
    </div>
  );
}
function Recent({ title, items }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((x, i) => (
            <div className="rounded-xl border border-line p-3" key={i}>
              <p className="text-sm font-semibold">{x.title}</p>
              <p className="mt-1 text-xs text-muted">
                {x.detail} · {new Date(x.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="py-12 text-center text-sm text-muted">
            No records yet.
          </p>
        )}
      </div>
    </Card>
  );
}
