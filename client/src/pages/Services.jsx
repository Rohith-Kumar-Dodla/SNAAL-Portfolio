import { ArrowRight, Check, MoveUpRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { ProductVisual, ProjectCard } from "../components/content";
import {
  Badge,
  Button,
  ErrorState,
  EmptyState,
  Loading,
  PageHeader,
  PageMotion,
  Reveal,
  Section,
  SectionHeader,
  Seo,
} from "../components/ui";

export function Services() {
  const { services, loading } = useContent();
  if (loading) return <Loading />;
  return (
    <PageMotion>
      <PageHeader
        path="/services"
        eyebrow="Services"
        title="Focused capability. Practical outcomes."
        copy="Product, platform and automation expertise organized around the business change it needs to support."
      />
      <Section>
        {!services.length && <EmptyState title="Services are being prepared" copy="Please check back shortly or contact SNAAL to discuss your requirement." />}
        <div className="border-t border-line">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug}>
                <article className="grid gap-7 border-b border-line py-9 lg:grid-cols-[80px_.8fr_1.2fr_auto] lg:items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-brand-600">
                      0{i + 1}
                    </span>
                    <h2 className="h3 mt-2">{service.title}</h2>
                  </div>
                  <div>
                    <p className="leading-7 text-muted">{service.short}</p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                      {service.capabilities.slice(0, 3).map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </div>
                  </div>
                  <Button
                    to={`/services/${service.slug}`}
                    variant="secondary"
                    aria-label={`Explore ${service.title}`}
                  >
                    Explore <ArrowRight size={16} />
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>
      <Section className="bg-canvas">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow="Not sure where to begin?"
            title="Start with the operation, not a service label."
            copy="Share what is changing in your business. We can shape the right technical conversation from there."
          />
          <Button to="/contact">
            Start a conversation <MoveUpRight size={17} />
          </Button>
        </div>
      </Section>
    </PageMotion>
  );
}

export function ServiceDetail() {
  const { services, projects, loading } = useContent();
  const { slug } = useParams();
  if (loading) return <Loading />;
  const service = services.find((x) => x.slug === slug);
  if (!service)
    return (
      <PageMotion>
        <PageHeader
          eyebrow="Service not found"
          title="That capability page isn’t available."
          copy="The service may have moved or the link may be incorrect."
        />
        <Section>
          <ErrorState message="We could not find this service." />
          <Button to="/services" className="mt-7">
            View all services
          </Button>
        </Section>
      </PageMotion>
    );
  const Icon = service.icon;
  return (
    <PageMotion>
      <Seo path={`/services/${slug}`} title={service.seo?.title || service.title} description={service.seo?.description || service.short} />
      <section className="blueprint-glow border-b border-line pb-20 pt-40">
        <div className="page-container grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Badge>Service capability</Badge>
            <span className="mt-7 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
              <Icon />
            </span>
            <h1 className="h1 mt-6">{service.title}</h1>
            <p className="body-lg mt-6 text-muted">{service.short}</p>
            <Button to="/contact" className="mt-8">
              Discuss this capability <ArrowRight size={17} />
            </Button>
          </div>
          <ProductVisual
            tone={service.accent}
            label={`${service.title} capability interface`}
          />
        </div>
      </section>
      <Section>
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Where it helps"
            title="Built around the problem behind the request."
          />
          <div>
            {service.problems.map((x, i) => (
              <div key={x} className="flex gap-5 border-t border-line py-6">
                <span className="text-xs font-bold text-brand-600">
                  0{i + 1}
                </span>
                <p className="font-display text-xl font-semibold">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="bg-canvas">
        <SectionHeader
          eyebrow="Capabilities"
          title="A connected delivery scope."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {service.capabilities.map((x) => (
            <div
              key={x}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 font-semibold"
            >
              <Check className="text-brand-600" size={18} />
              {x}
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Approach"
            title="Progress from context to working product."
          />
          <ol className="border-l border-brand-200">
            {service.approach.map((x, i) => (
              <li className="relative pb-10 pl-9 last:pb-0" key={x}>
                <span className="absolute -left-4 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="h3">{x}</h3>
                <p className="mt-2 text-muted">
                  Each stage creates a concrete decision point before the next
                  investment.
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section className="bg-ink text-white">
        <div className="flex flex-wrap gap-3">
          {service.technologies.map((x) => (
            <span
              key={x}
              className="rounded-full border border-white/20 px-4 py-2 text-sm"
            >
              {x}
            </span>
          ))}
        </div>
        <h2 className="h2 mt-8 max-w-3xl">
          Technology selected for the product, team and operating reality.
        </h2>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Related work"
          title="See the approach in context."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.slice(0, 2).map((x) => (
            <ProjectCard key={x.slug} project={x} />
          ))}
        </div>
      </Section>
    </PageMotion>
  );
}
