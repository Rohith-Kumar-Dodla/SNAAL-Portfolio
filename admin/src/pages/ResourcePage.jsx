import { useEffect, useMemo, useState } from "react";
import { Archive, Edit3, ImagePlus, Plus, RefreshCw, Search, Upload, X } from "lucide-react";
import { PageHeader, EmptyState, Loading, StatusBadge } from "../components/ui";
import { api, data, apiError } from "../services/api";
const configs = {
  projects: {
    label: "Projects",
    endpoint: "projects",
    fields: [
      ["name", "Project name"],
      ["slug", "Slug"],
      ["shortDescription", "Short description", "textarea"],
      ["description", "Description", "textarea"],
      ["category", "Category"],
      ["categories", "Categories", "array"],
      ["type", "Format"],
      ["year", "Year"],
      ["thumbnail", "Thumbnail", "media"],
      ["heroImage", "Hero image", "media"],
      ["gallery", "Screenshot gallery", "mediaArray"],
      ["challenge", "Challenge", "textarea"],
      ["approach", "Approach", "textarea"],
      ["solution", "Solution", "textarea"],
      ["features", "Features", "array"],
      ["technologies", "Technologies", "array"],
      ["architecture", "Architecture", "textarea"],
      ["developmentProcess", "Development process", "textarea"],
      ["results", "Results", "array"],
      ["liveUrl", "Live URL"],
      ["repositoryUrl", "Repository URL"],
      ["displayOrder", "Display order", "number"],
      ["featured", "Featured", "checkbox"],
      ["status", "Status", "status"],
      ["seo.title", "SEO title"],
      ["seo.description", "SEO description", "textarea"],
    ],
  },
  services: {
    label: "Services",
    endpoint: "services",
    fields: [
      ["name", "Name"],
      ["slug", "Slug"],
      ["summary", "Summary", "textarea"],
      ["description", "Description", "textarea"],
      ["icon", "Icon key"],
      ["visual", "Visual key"],
      ["relatedProjects", "Related project IDs", "array"],
      ["capabilities", "Capabilities", "array"],
      ["technologies", "Technologies", "array"],
      ["problems", "Problems solved", "array"],
      ["process", "Process", "array"],
      ["displayOrder", "Display order", "number"],
      ["featured", "Featured", "checkbox"],
      ["status", "Status", "status"],
      ["seo.title", "SEO title"],
      ["seo.description", "SEO description", "textarea"],
    ],
  },
  technologies: {
    label: "Technologies",
    endpoint: "technologies",
    fields: [
      ["name", "Name"],
      ["slug", "Slug"],
      ["category", "Category", "category"],
      ["description", "Description", "textarea"],
      ["logo", "Logo", "media"],
      ["websiteUrl", "Website URL"],
      ["displayOrder", "Display order", "number"],
      ["featured", "Featured", "checkbox"],
      ["status", "Status", "status"],
    ],
  },
  insights: {
    label: "Insights",
    endpoint: "insights",
    fields: [
      ["title", "Title"],
      ["slug", "Slug"],
      ["excerpt", "Excerpt", "textarea"],
      ["category", "Category"],
      ["author", "Author"],
      ["coverImage", "Cover image", "media"],
      ["content", "Article sections", "contentBlocks"],
      ["readingTime", "Reading time", "number"],
      ["featured", "Featured", "checkbox"],
      ["status", "Status", "status"],
      ["publishedAt", "Publication date", "date"],
      ["seo.title", "SEO title"],
      ["seo.description", "SEO description", "textarea"],
    ],
  },
  testimonials: {
    label: "Testimonials",
    endpoint: "testimonials",
    fields: [
      ["clientName", "Client name"],
      ["clientRole", "Client role"],
      ["company", "Company"],
      ["quote", "Quote", "textarea"],
      ["photo", "Photo", "media"],
      ["companyLogo", "Company logo", "media"],
      ["project", "Related project ID"],
      ["displayOrder", "Display order", "number"],
      ["featured", "Featured", "checkbox"],
      ["status", "Status", "status"],
    ],
  },
  team: {
    label: "Team",
    endpoint: "team",
    fields: [
      ["name", "Name"],
      ["designation", "Designation"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["profileImage", "Profile image", "media"],
      ["status", "Status", "teamStatus"],
    ],
  },
};
const get = (obj, path) => path.split(".").reduce((v, k) => v?.[k], obj);
const set = (obj, path, value) => {
  const keys = path.split(".");
  let target = obj;
  keys.slice(0, -1).forEach((k) => {
    target[k] ??= {};
    target = target[k];
  });
  target[keys.at(-1)] = value;
};
export default function ResourcePage({ type }) {
  if (type === "media") return <Media />;
  if (type === "content") return <Content />;
  if (type === "settings") return <Settings />;
  if (type === "activity") return <Activity />;
  if (type === "leads" || type === "site-visits")
    return <Operations type={type} />;
  return <Crud config={configs[type]} />;
}
function Crud({ config }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [query, setQuery] = useState("");
  const load = () => {
    setLoading(true);
    data(api.get(`/admin/${config.endpoint}?limit=50`))
      .then(setRows)
      .catch((e) => setError(apiError(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, [config.endpoint]);
  const visible = useMemo(
    () =>
      rows.filter((x) =>
        JSON.stringify(x).toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );
  async function archive(row) {
    if (confirming !== row._id) { setConfirming(row._id); return; }
    await api.delete(`/admin/${config.endpoint}/${row._id}`);
    setConfirming(null);
    load();
  }
  return (
    <div className="space-y-7">
      <PageHeader
        title={config.label}
        description={`Manage published and draft ${config.label.toLowerCase()} from MongoDB.`}
        action={false}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="admin-input !mt-0"
          placeholder="Search records"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => setEditing({})} className="admin-button">
          <Plus size={17} />
          Create new
        </button>
      </div>
      {error && <p className="error-box">{error}</p>}
      {loading ? (
        <Loading />
      ) : visible.length ? (
        <div className="admin-table">
          {visible.map((row) => (
            <article className="admin-row" key={row._id}>
              <div>
                <p className="font-semibold">
                  {row.name || row.title || row.clientName}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {row.category ||
                    row.company ||
                    row.email ||
                    "Managed content"}
                </p>
              </div>
              <StatusBadge>{row.status}</StatusBadge>
              <div className="flex justify-end gap-2">
                <button
                  className="icon-button"
                  onClick={() => setEditing(row)}
                  aria-label="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="icon-button text-red-700"
                  onClick={() => archive(row)}
                  aria-label={confirming === row._id ? "Confirm archive" : "Archive"}
                >
                  {confirming === row._id ? "Confirm" : <Archive size={16} />}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState label={config.label.toLowerCase()} />
      )}{" "}
      {editing && (
        <Editor
          config={config}
          value={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
function Editor({ config, value, onClose, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  useEffect(()=>{const warn=e=>{if(dirty){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn)},[dirty]);
  const close=()=>dirty?setConfirmClose(true):onClose();
  async function save(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {};
    try {
      for (const [name, , type] of config.fields) {
        let v = type === "checkbox" ? form.get(name) === "on" : form.get(name);
        if (type === "array")
          v = v
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean);
        if (type === "number") v = Number(v) || 0;
        if (type === "json") v = JSON.parse(v || "[]");
        if (type === "media") v = v ? JSON.parse(v) : {};
        if (type === "mediaArray") v = v ? JSON.parse(v) : [];
        if (type === "contentBlocks") v = JSON.parse(v || "[]");
        if (v !== "" && v !== undefined) set(body, name, v);
      }
      setBusy(true);
      value._id
        ? await api.patch(`/admin/${config.endpoint}/${value._id}`, body)
        : await api.post(`/admin/${config.endpoint}`, body);
      onSaved();
    } catch (err) {
      setError(
        err instanceof SyntaxError ? "Content JSON is invalid." : apiError(err),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="modal-backdrop">
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${config.label}`}
      >
        <header className="flex items-center justify-between border-b border-line p-5">
          <div>
            <h2 className="font-display text-xl font-bold">
              {value._id ? "Edit" : "Create"} {config.label}
            </h2>
            <p className="text-xs text-muted">
              Save as draft or publish when ready.
            </p>
          </div>
          <button onClick={close} className="icon-button" aria-label="Close">
            <X />
          </button>
        </header>
        <form onSubmit={save} onChange={()=>setDirty(true)} className="grid gap-5 p-5 sm:grid-cols-2">
          {confirmClose&&<div className="error-box flex items-center justify-between gap-3 sm:col-span-2"><span>Discard unsaved changes?</span><span className="flex gap-2"><button type="button" onClick={()=>setConfirmClose(false)}>Keep editing</button><button type="button" className="font-bold" onClick={onClose}>Discard</button></span></div>}
          {config.fields.map(([name, label, type]) => (
            <Field
              key={name}
              name={name}
              label={label}
              type={type}
              value={get(value, name)}
            />
          ))}
          {error && (
            <p className="error-box sm:col-span-2" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-line pt-5 sm:col-span-2">
            <button
              type="button"
              className="secondary-button"
              onClick={close}
            >
              Cancel
            </button>
            <button disabled={busy} className="admin-button">
              {busy ? "Saving…" : "Save record"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
function Field({ name, label, type, value }) {
  if (type === "media")
    return <MediaPickerField name={name} label={label} value={value} />;
  if (type === "mediaArray")
    return <MediaPickerField name={name} label={label} value={value} multiple />;
  if (type === "contentBlocks")
    return <ContentBlocksField name={name} label={label} value={value} />;
  if (type === "checkbox")
    return (
      <label className="flex items-center gap-3 self-end rounded-xl border border-line p-4">
        <input name={name} type="checkbox" defaultChecked={Boolean(value)} />
        {label}
      </label>
    );
  if (["status", "teamStatus", "leadStatus", "visitStatus", "category"].includes(type))
    return (
      <label className="field">
        {label}
        <select name={name} className="admin-input" defaultValue={value || ""}>
          <option value="">Select</option>
          {(type === "status"
            ? ["draft", "published", "archived"]
            : type === "teamStatus"
              ? ["active", "inactive"]
              : type === "leadStatus"
                ? ["new", "contacted", "discussion", "proposal", "won", "closed", "spam"]
                : type === "visitStatus"
                  ? ["new", "reviewing", "scheduled", "completed", "cancelled"]
              : [
                  "frontend",
                  "backend",
                  "mobile",
                  "database",
                  "cloud",
                  "devops",
                  "data",
                  "ai",
                  "automation",
                  "other",
                ]
          ).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
    );
  const long = ["textarea", "array", "json"].includes(type);
  let initial = value ?? "";
  if (type === "array") initial = Array.isArray(value) ? value.join("\n") : "";
  if (type === "json") initial = JSON.stringify(value || (["content", "gallery"].includes(name) ? [] : {}), null, 2);
  return (
    <label className={`field ${long ? "sm:col-span-2" : ""}`}>
      {label}
      {long ? (
        <textarea
          name={name}
          rows={type === "json" ? 10 : 4}
          className="admin-input !h-auto py-3"
          defaultValue={initial}
        />
      ) : (
        <input
          name={name}
          type={type || "text"}
          className="admin-input"
          defaultValue={
            type === "date" && value ? String(value).slice(0, 10) : initial
          }
        />
      )}
    </label>
  );
}
function ContentBlocksField({ name, label, value }) {
  const [blocks, setBlocks] = useState(Array.isArray(value) && value.length ? value : [{ heading: "", paragraphs: [""] }]);
  const update = (index, key, next) => setBlocks((current) => current.map((block, i) => i === index ? { ...block, [key]: next } : block));
  return (
    <div className="field sm:col-span-2">
      <span>{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(blocks.map((block)=>({heading:block.heading.trim(),paragraphs:block.paragraphs.filter(Boolean)})))} />
      <div className="mt-2 space-y-4">
        {blocks.map((block,index)=><section key={index} className="rounded-2xl border border-line bg-slate-50 p-4">
          <div className="flex items-center justify-between"><strong>Section {index+1}</strong>{blocks.length>1&&<button type="button" className="icon-button text-red-700" aria-label={`Remove section ${index+1}`} onClick={()=>setBlocks((current)=>current.filter((_,i)=>i!==index))}><X size={16}/></button>}</div>
          <label className="mt-3 block text-xs font-semibold text-muted">Heading<input className="admin-input bg-white" value={block.heading} onChange={(event)=>update(index,"heading",event.target.value)} /></label>
          <label className="mt-3 block text-xs font-semibold text-muted">Paragraphs <span className="font-normal">(one per line)</span><textarea className="admin-input !h-auto bg-white py-3" rows="5" value={block.paragraphs.join("\n")} onChange={(event)=>update(index,"paragraphs",event.target.value.split("\n"))} /></label>
        </section>)}
        <button type="button" className="secondary-button" onClick={()=>setBlocks((current)=>[...current,{heading:"",paragraphs:[""]}])}><Plus size={16}/>Add section</button>
      </div>
    </div>
  );
}
function MediaPickerField({ name, label, value, multiple = false }) {
  const [selected, setSelected] = useState(multiple ? (Array.isArray(value) ? value : []) : (value || null));
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    data(api.get("/admin/media?limit=50"))
      .then(setRows)
      .finally(() => setLoading(false));
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const filtered = rows.filter((row) =>
    `${row.publicId} ${row.alt || ""} ${row.folder || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const select = (row) => {
    const reference = { media: row._id, url: row.secureUrl, alt: row.alt || "" };
    if (multiple) {
      setSelected((current) => current.some((item) => item.media === row._id) ? current.filter((item) => item.media !== row._id) : [...current, reference]);
    } else {
      setSelected(reference);
      setOpen(false);
    }
  };
  const hasSelection = multiple ? selected.length > 0 : Boolean(selected);
  return (
    <div className="field sm:col-span-2">
      <span>{label}</span>
      <input type="hidden" name={name} value={hasSelection ? JSON.stringify(selected) : ""} />
      <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-line bg-slate-50 p-3 sm:flex-row sm:items-center">
        {(multiple ? selected[0]?.url : selected?.url) ? (
          <div className="flex h-24 w-full gap-2 overflow-hidden sm:w-48">{(multiple ? selected.slice(0,3) : [selected]).map((item)=><img key={item.media||item.url} src={item.url} alt={item.alt||""} className="min-w-0 flex-1 rounded-xl object-cover" />)}</div>
        ) : (
          <div className="grid h-24 w-full place-items-center rounded-xl border border-dashed border-slate-300 text-muted sm:w-36"><ImagePlus /></div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{multiple ? `${selected.length} asset${selected.length===1?"":"s"} selected` : selected?.alt || "No media selected"}</p>
          <p className="mt-1 truncate text-xs font-normal text-muted">{multiple ? "Choose and order gallery assets from the media library." : selected?.url || "Choose an existing Cloudinary asset."}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="secondary-button" onClick={() => setOpen(true)}>{hasSelection ? "Replace" : "Choose media"}</button>
          {hasSelection && <button type="button" className="icon-button text-red-700" aria-label={`Clear ${label}`} onClick={() => setSelected(multiple ? [] : null)}><X size={17}/></button>}
        </div>
      </div>
      {open && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section className="modal-panel max-w-5xl" role="dialog" aria-modal="true" aria-label={`Choose ${label}`}>
            <header className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><h3 className="font-display text-xl font-bold">Choose media</h3><p className="mt-1 text-sm font-normal text-muted">Select a Cloudinary asset; its structured reference is bound automatically.</p></div>
              <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close media picker"><X /></button>
            </header>
            <div className="p-5">
              <label className="relative block"><span className="sr-only">Search media</span><Search className="absolute left-3 top-3.5 text-muted" size={18}/><input className="admin-input !mt-0 pl-10" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search by alt text, folder or public ID" autoFocus /></label>
              {loading ? <Loading /> : filtered.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((row)=>{const active=multiple&&selected.some((item)=>item.media===row._id);return <button type="button" key={row._id} onClick={()=>select(row)} aria-pressed={multiple?active:undefined} className={`overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:border-brand-500 ${active?"border-brand-500 ring-2 ring-brand-100":"border-line hover:border-brand-300"}`}><img src={row.secureUrl} alt={row.alt || ""} className="aspect-video w-full object-cover" loading="lazy"/><span className="block p-3"><strong className="block truncate text-sm">{row.alt || row.publicId}</strong><span className="mt-1 block truncate text-xs font-normal text-muted">{row.width}×{row.height} · {row.folder}</span></span></button>})}</div> : <EmptyState label="matching media" />}
              {multiple&&<div className="sticky bottom-0 mt-5 flex justify-end border-t border-line bg-white pt-4"><button type="button" className="admin-button" onClick={()=>setOpen(false)}>Use {selected.length} selected</button></div>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function Operations({ type }) {
  const endpoint = type === "leads" ? "contact-leads" : "site-visits";
  const label = type === "leads" ? "Contact leads" : "Site visits";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [team, setTeam] = useState([]);
  const load = () => {
    data(api.get(`/admin/${endpoint}?limit=50`))
      .then(setRows)
      .finally(() => setLoading(false));
  };
  useEffect(load, [endpoint]);
  useEffect(() => {
    if (type === "site-visits") {
      data(api.get("/admin/team?limit=50&status=active"))
        .then(setTeam)
        .catch(() => setTeam([]));
    }
  }, [type]);
  async function save(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      status: f.get("status"),
      internalNotes: f.get("internalNotes"),
    };
    if (type === "site-visits") {
      body.assignedTeamMembers = f.get("assignedTeamMembers")
        ? [f.get("assignedTeamMembers")]
        : [];
      body.scheduledDate = f.get("scheduledDate") || undefined;
      body.scheduledTime = f.get("scheduledTime") || undefined;
    }
    await api.patch(`/admin/${endpoint}/${editing._id}`, body);
    setEditing(null);
    load();
  }
  return (
    <div className="space-y-7">
      <PageHeader
        title={label}
        description="Real submissions stored in MongoDB."
        action={false}
      />
      {loading ? (
        <Loading />
      ) : rows.length ? (
        <div className="admin-table">
          {rows.map((row) => (
            <button
              onClick={() => setEditing(row)}
              className="admin-row text-left"
              key={row._id}
            >
              <div>
                <p className="font-semibold">
                  {row.name} · {row.company}
                </p>
                <p className="text-xs text-muted">
                  {row.email} ·{" "}
                  {type === "site-visits"
                    ? new Date(row.preferredVisitDate).toLocaleDateString()
                    : row.service}
                </p>
              </div>
              <StatusBadge>{row.status}</StatusBadge>
              <span className="text-right text-xs text-muted">
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState label={label.toLowerCase()} />
      )}{" "}
      {editing && (
        <div className="modal-backdrop">
          <section className="modal-panel">
            <header className="flex justify-between border-b p-5">
              <h2 className="font-display text-xl font-bold">{editing.name}</h2>
              <button onClick={() => setEditing(null)}>
                <X />
              </button>
            </header>
            <div className="whitespace-pre-wrap p-5 text-sm leading-7">
              {editing.message || editing.projectDescription}
            </div>
            <form onSubmit={save} className="grid gap-4 border-t p-5">
              <Field
                name="status"
                label="Status"
                type={type === "leads" ? "leadStatus" : "visitStatus"}
                value={editing.status}
              />
              {type === "site-visits" && (
                <>
                  <label className="field">
                    Assigned team member
                    <select
                      name="assignedTeamMembers"
                      className="admin-input"
                      defaultValue={editing.assignedTeamMembers?.[0] || ""}
                    >
                      <option value="">Unassigned</option>
                      {team.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} — {member.designation}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    name="scheduledDate"
                    label="Scheduled date"
                    type="date"
                    value={editing.scheduledDate}
                  />
                  <Field
                    name="scheduledTime"
                    label="Scheduled time"
                    type="time"
                    value={editing.scheduledTime}
                  />
                </>
              )}
              <Field
                name="internalNotes"
                label="Internal notes"
                type="textarea"
                value={editing.internalNotes}
              />
              <button className="admin-button">Save workflow</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
function Media() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const load = () => {
    data(api.get("/admin/media?limit=50"))
      .then(setRows)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  async function upload(e) {
    e.preventDefault();
    const body = new FormData(e.currentTarget);
    if (file) body.set("file", file);
    if (!body.get("file")?.size) { setError("Choose or drop an image before uploading."); return; }
    try {
      setBusy(true);
      setProgress(0);
      setError("");
      await api.post("/admin/media", body, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => setProgress(event.total ? Math.round((event.loaded / event.total) * 100) : 0),
      });
      e.currentTarget.reset();
      setFile(null);
      setProgress(100);
      load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }
  async function remove(row) {
    if (confirming !== row._id) { setConfirming(row._id); return; }
    try {
      await api.delete(`/admin/media/${row._id}`);
      setConfirming(null);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  }
  async function updateMetadata(event, row) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.patch(`/admin/media/${row._id}`, {
        alt: form.get("alt"),
        caption: form.get("caption"),
      });
      load();
    } catch (err) {
      setError(apiError(err));
    }
  }
  return (
    <div className="space-y-7">
      <PageHeader
        title="Media"
        description="Cloudinary assets and MongoDB metadata."
        action={false}
      />
      <form onSubmit={upload} className="card grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <label
          className={`grid min-h-40 cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-6 text-center transition ${dragging ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50 hover:border-brand-300"}`}
          onDragOver={(event)=>{event.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={(event)=>{event.preventDefault();setDragging(false);const dropped=event.dataTransfer.files?.[0];if(dropped)setFile(dropped)}}
        >
          <input name="file" type="file" className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event)=>setFile(event.target.files?.[0]||null)} />
          <span><Upload className="mx-auto text-brand-600"/><strong className="mt-3 block">{file?.name || "Drop an image here"}</strong><span className="mt-1 block text-sm text-muted">or click to browse · JPG, PNG, WebP, GIF or AVIF · max 8 MB</span></span>
        </label>
        <div className="grid content-start gap-3">
        <select name="folder" className="admin-input !mt-0" aria-label="Media folder">
          <option>general</option>
          <option>projects</option>
          <option>services</option>
          <option>insights</option>
          <option>team</option>
          <option>testimonials</option>
        </select>
        <input
          name="alt"
          className="admin-input !mt-0"
          placeholder="Alt text"
        />
        <button className="admin-button" disabled={busy}>
          <Upload size={17} />
          {busy ? `Uploading ${progress}%` : error && file ? "Retry upload" : "Upload"}
        </button>
        {busy && <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><div className="h-full bg-brand-600 transition-all" style={{width:`${progress}%`}}/></div>}
        </div>
      </form>
      {error && <p className="error-box">{error}</p>}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <article className="card" key={row._id}>
              <img
                src={row.secureUrl}
                alt={row.alt || ""}
                className="aspect-video w-full rounded-xl object-cover"
              />
              <p className="mt-3 truncate text-sm font-semibold">
                {row.publicId}
              </p>
              <p className="text-xs text-muted">
                {row.width}×{row.height} · {Math.round(row.bytes / 1024)} KB
              </p>
              <form className="mt-3 grid gap-2" onSubmit={(event)=>updateMetadata(event,row)}>
                <label className="text-xs font-semibold text-muted">Alt text<input name="alt" defaultValue={row.alt||""} className="admin-input !mt-1 !min-h-10" /></label>
                <label className="text-xs font-semibold text-muted">Caption<input name="caption" defaultValue={row.caption||""} className="admin-input !mt-1 !min-h-10" /></label>
                <button className="secondary-button !min-h-10">Save metadata</button>
              </form>
              <button className="mt-3 mr-4 text-sm font-semibold text-brand-700" onClick={()=>navigator.clipboard?.writeText(JSON.stringify({media:row._id,url:row.secureUrl,alt:row.alt||""}))}>Copy reference</button>
              <button
                className="mt-3 text-sm font-semibold text-red-700"
                onClick={() => remove(row)}
              >
                {confirming === row._id ? "Confirm deletion" : "Delete safely"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function Content() {
  const [value, setValue] = useState("{}");
  const [key, setKey] = useState("home");
  const [message, setMessage] = useState("");
  useEffect(()=>{data(api.get('/site-content')).then(rows=>{const record=rows.find(x=>x.key===key);setValue(JSON.stringify(record?.sections||{},null,2))}).catch(()=>setValue('{}'))},[key]);
  async function save() {
    try {
      await api.put(`/admin/site-content/${key}`, {
        sections: JSON.parse(value),
        status: "published",
      });
      setMessage("Website content saved and published.");
    } catch (e) {
      setMessage(apiError(e));
    }
  }
  return (
    <div className="space-y-7">
      <PageHeader
        title="Website content"
        description="Edit controlled section data without changing the React layout."
        action={false}
      />
      <div className="card space-y-4">
        <select
          className="admin-input"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          {["home", "about", "contact", "footer"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <textarea
          className="admin-input !h-auto py-3 font-mono text-sm"
          rows="22"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="admin-button" onClick={save}>
          Publish content
        </button>
        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
function Settings() {
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({});
  useEffect(()=>{data(api.get('/site-settings')).then(setSettings).catch(()=>{})},[]);
  async function save(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api.put("/admin/site-settings", {
        companyName: f.get("companyName"),
        publicEmail: f.get("publicEmail"),
        publicPhone: f.get("publicPhone"),
        businessHours: f.get("businessHours"),
        defaultSeo: {
          title: f.get("seoTitle"),
          description: f.get("seoDescription"),
        },
        logo: f.get("logo") ? JSON.parse(f.get("logo")) : {},
      });
      setMessage("Public settings saved.");
    } catch (err) {
      setMessage(apiError(err));
    }
  }
  return (
    <div className="space-y-7">
      <PageHeader
        title="Settings"
        description="Public company details only. Secrets are never editable here."
        action={false}
      />
      <form onSubmit={save} className="card grid gap-5 sm:grid-cols-2">
        {[
          ["companyName", "Company display name"],
          ["publicEmail", "Public email"],
          ["publicPhone", "Public phone"],
          ["businessHours", "Business hours"],
          ["seoTitle", "Default SEO title"],
          ["seoDescription", "Default SEO description"],
        ].map(([name, label]) => (
          <Field key={name} name={name} label={label} value={name==='seoTitle'?settings.defaultSeo?.title:name==='seoDescription'?settings.defaultSeo?.description:settings[name]} />
        ))}
        <Field name="logo" label="Public logo" type="media" value={settings.logo} />
        <button className="admin-button sm:col-span-2">Save settings</button>
        {message && <p role="status">{message}</p>}
      </form>
    </div>
  );
}
function Activity() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    data(api.get("/admin/activity")).then(setRows);
  }, []);
  return (
    <div className="space-y-7">
      <PageHeader
        title="Activity"
        description="Recent CMS actions without sensitive payloads."
        action={false}
      />
      {rows.length ? (
        <div className="admin-table">
          {rows.map((x) => (
            <div className="admin-row" key={x._id}>
              <p className="font-semibold">{x.action}</p>
              <p className="text-sm text-muted">
                {x.actor?.name || "Administrator"}
              </p>
              <time className="text-right text-xs text-muted">
                {new Date(x.createdAt).toLocaleString()}
              </time>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState label="activity records" />
      )}
    </div>
  );
}
