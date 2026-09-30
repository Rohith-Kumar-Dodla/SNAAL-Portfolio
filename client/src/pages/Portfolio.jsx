import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, GitBranch } from "lucide-react";
import { useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import {
  BrowserFrame,
  MobileFrame,
  ProductVisual,
  ProjectCard,
} from "../components/content";
import {
  Badge,
  Button,
  ErrorState,
  EmptyState,
  Loading,
  PageHeader,
  PageMotion,
  Section,
  SectionHeader,
  Seo,
} from "../components/ui";

export function Portfolio() {
  const { projects, loading } = useContent();
  const filters = ["All", ...new Set(projects.map((x) => x.category))];
  const [filter, setFilter] = useState("All");
  if (loading) return <Loading />;
  const visible =
    filter === "All" ? projects : projects.filter((x) => x.category === filter);
  return (
    <PageMotion>
      <PageHeader
        path="/portfolio"
        eyebrow="Portfolio"
        title="Product thinking, made visible."
        copy="Demonstration case studies show how SNAAL frames problems and translates them into coherent product systems. They do not represent unverified client engagements."
      />
      <Section>
        {!projects.length && <EmptyState title="Case studies are being prepared" copy="Published project stories will appear here." />}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects"
        >
          {filters.map((x) => (
            <button
              key={x}
              onClick={() => setFilter(x)}
              aria-pressed={filter === x}
              className={`min-h-11 rounded-full px-5 text-sm font-semibold transition ${filter === x ? "bg-brand-600 text-white" : "border border-line bg-white text-slate-600 hover:border-brand-200"}`}
            >
              {x}
            </button>
          ))}
        </div>
        <motion.div
          layout
          className="mt-12 grid gap-x-7 gap-y-14 md:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((x) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                key={x.slug}
              >
                <ProjectCard project={x} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>
      <Section className="bg-canvas">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow="Your project belongs here"
            title="Bring us the operational problem behind the brief."
            copy="The best first conversation is specific about the change you need, even when the solution is not yet clear."
          />
          <Button to="/contact">
            Start a conversation <ArrowRight size={17} />
          </Button>
        </div>
      </Section>
    </PageMotion>
  );
}

export function ProjectDetail() {
  const { projects, loading } = useContent();
  const { slug } = useParams();
  if (loading) return <Loading />;
  const project = projects.find((x) => x.slug === slug);
  if (!project)
    return (
      <PageMotion>
        <PageHeader
          eyebrow="Project not found"
          title="That case study isn’t available."
          copy="The project may have moved or the link may be incorrect."
        />
        <Section>
          <ErrorState message="We could not find this case study." />
          <Button to="/portfolio" className="mt-7">
            View all projects
          </Button>
        </Section>
      </PageMotion>
    );
  const related = projects.filter((x) => x.slug !== slug).slice(0, 2);
  return (
    <PageMotion>
      <Seo path={`/portfolio/${slug}`} title={project.seo?.title || project.title} description={project.seo?.description || project.description} image={project.heroImage?.url || project.thumbnail?.url} />
      <section className="blueprint-glow border-b border-line pb-16 pt-40">
        <div className="page-container">
          <Badge>
            {project.category} · {project.year}
          </Badge>
          <h1 className="display mt-7 max-w-5xl text-balance">
            {project.title}
          </h1>
          <p className="body-lg mt-7 max-w-3xl text-muted">
            {project.description}
          </p>
          <div className="mt-12">
            <ProductVisual
              tone={project.tone}
              label={`${project.title} hero interface`}
            />
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Project snapshot</p>
            <div className="mt-6 space-y-5 border-t border-line pt-5 text-sm">
              <p>
                <b className="block text-ink">Format</b>
                <span className="text-muted">Demonstration case study</span>
              </p>
              <p>
                <b className="block text-ink">Category</b>
                <span className="text-muted">{project.category}</span>
              </p>
              <p>
                <b className="block text-ink">Technology</b>
                <span className="text-muted">
                  {project.technologies.join(", ")}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h2 className="h2">What the product needed to make clearer.</h2>
            <p className="body-lg mt-6 text-muted">{project.challenge}</p>
          </div>
        </div>
      </Section>
      <Section className="bg-canvas">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-brand-600 p-8 text-white sm:p-10">
            <p className="eyebrow !text-blue-100">Our approach</p>
            <h2 className="h2 mt-5">Understand before prescribing.</h2>
            <p className="mt-6 text-lg leading-8 text-blue-50">
              {project.approach}
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-8 sm:p-10">
            <p className="eyebrow">The solution</p>
            <h2 className="h2 mt-5">One coherent working model.</h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              {project.solution}
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Feature showcase"
          title="The essential workflow, without the noise."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {project.features.map((x, i) => (
            <div key={x} className="bg-white p-7">
              <span className="text-xs font-bold text-brand-600">0{i + 1}</span>
              <h3 className="mt-14 font-display text-xl font-semibold">{x}</h3>
            </div>
          ))}
        </div>
      </Section>
      <Section className="bg-canvas">
        <SectionHeader
          eyebrow="Screenshot story"
          title="Product screens presented in context."
          copy="Reusable browser and mobile frames keep future Cloudinary-hosted project media consistent and presentation-ready."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
          <BrowserFrame title={`${project.title} · overview`}>
            <ProductVisual
              tone={project.tone}
              compact
              label={`${project.title} desktop view`}
            />
          </BrowserFrame>
          <MobileFrame>
            <ProductVisual
              tone={project.tone}
              compact
              label={`${project.title} mobile view`}
            />
          </MobileFrame>
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <GitBranch className="text-brand-600" size={30} />
            <p className="eyebrow mt-7">Engineering</p>
            <h2 className="h2 mt-4">Architecture that explains itself.</h2>
          </div>
          <div>
            <p className="body-lg text-muted">{project.engineering}</p>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {project.technologies.map((x) => (
                <span
                  key={x}
                  className="rounded-xl border border-line p-4 text-center text-sm font-semibold"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <Section className="bg-ink text-white">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <CheckCircle2 className="text-blue-300" />
            <p className="eyebrow mt-7 !text-blue-300">Outcome architecture</p>
          </div>
          <div>
            <h2 className="h2">Evidence without invented metrics.</h2>
            <p className="body-lg mt-6 text-slate-300">{project.outcome}</p>
            <p className="mt-6 text-sm text-slate-400">
              No live project or public repository link is shown because neither
              has been verified for this demonstration entry.
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Related projects"
          title="Continue exploring the work."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {related.map((x) => (
            <ProjectCard key={x.slug} project={x} />
          ))}
        </div>
      </Section>
    </PageMotion>
  );
}
